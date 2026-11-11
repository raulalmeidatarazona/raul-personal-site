"""Import a public RSS export; never changes the publication or domain.

Usage: python3 scripts/import_substack.py /path/to/public-feed.xml
Review the generated catalogue and HTML before committing.
"""
import hashlib
import html
import json
import re
import sys
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
from datetime import timezone
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
FEED_URL = 'https://raulalmeidablog.substack.com/feed'
MEDIA_HOSTS = {'substackcdn.com', 'substack-post-media.s3.amazonaws.com'}
POST_HOSTS = {'raulalmeidablog.substack.com', 'raulalmeida.com'}
VOID = {'img', 'br', 'hr', 'source', 'input', 'meta', 'link', 'wbr', 'area', 'embed', 'param', 'track', 'col'}
ALLOWED = set('p strong em b i code pre ul ol li blockquote h1 h2 h3 h4 h5 h6 hr br figure figcaption table thead tbody tr th td div span a img del s sup sub kbd'.split())
BLOCKED = {'script', 'style', 'iframe', 'form', 'button', 'svg', 'object', 'embed'}
WIDGET_CLASSES = {'subscription-widget-wrap-editor', 'button-wrapper', 'captioned-button-wrap', 'image-link-expand', 'preamble'}
SERIES = ['the-polling-tax-how-to-decouple-legacy', 'building-the-go-streamer-reading', 'from-binlog-to-cloudevents-building', 'idempotent-consumers-anti-corruption']
EDITORIAL = {
    SERIES[0]: ('en', 'Legacy & integrations', 'Capture relevant changes with triggers and a transactional outbox, without rewriting the legacy application.'),
    SERIES[1]: ('en', 'Go & change data capture', 'Follow MySQL BinLogs with GTIDs, checkpointing and a bounded pipeline instead of introducing another polling loop.'),
    SERIES[2]: ('en', 'Events & messaging', 'Turn database changes into stable event contracts and introduce a durable messaging boundary.'),
    SERIES[3]: ('en', 'Reliability & AI', 'Handle repeated events, protect the domain model and separate analytical reads from operational writes.'),
    'estrategias-comprobadas-para-reducir': ('es', 'Testing & delivery', 'Cómo reducir la espera de las pruebas y los pre-push hooks sin renunciar a las comprobaciones importantes.'),
    'git-hooks-pre-push-y-draft-pull-request': ('es', 'Engineering workflow', 'Una estrategia de comprobaciones locales y draft pull requests para acortar los ciclos de feedback.'),
}


def digest(text):
    return hashlib.sha256(text.encode()).hexdigest()


def original_image(url):
    if urlsplit(url).hostname not in MEDIA_HOSTS:
        raise ValueError('Unexpected media host')
    if urlsplit(url).hostname == 'substackcdn.com':
        encoded = url.rsplit('/', 1)[-1]
        candidate = unquote(encoded)
        if candidate.startswith('https://'):
            url = candidate
    if urlsplit(url).hostname not in MEDIA_HOSTS:
        raise ValueError('Unexpected original media host')
    return url


def image_path(url):
    name = urlsplit(original_image(url)).path.rsplit('/', 1)[-1]
    if not re.fullmatch(r'[A-Za-z0-9_.-]+\.(?:png|jpg|jpeg|webp)', name):
        raise ValueError('Unsupported image filename: ' + name)
    return '/images/articles/' + name


class SourceStructure(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.images = []
        self.blocks = []
        self.open_blocks = []

    def handle_starttag(self, tag, attrs):
        attrs = {key: value or '' for key, value in attrs}
        if tag == 'img':
            self.images.append(attrs['src'])
        if tag == 'pre':
            self.open_blocks.append([])

    def handle_data(self, data):
        for block in self.open_blocks:
            block.append(data)

    def handle_endtag(self, tag):
        if tag == 'pre':
            self.blocks.append(''.join(self.open_blocks.pop()))


class ArticleHTML(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.output = []

    def handle_starttag(self, tag, attrs):
        attrs = {key: value or '' for key, value in attrs}
        skip = any(entry[2] for entry in self.stack) or tag in BLOCKED or bool(set(attrs.get('class', '').split()) & WIDGET_CLASSES)
        emitted = ('h2' if tag == 'h1' else tag) if tag in ALLOWED and not skip else None
        if tag not in VOID:
            self.stack.append((tag, emitted, skip))
        if not emitted:
            return
        clean = {}
        if re.fullmatch(r'[A-Za-z0-9_-]+', attrs.get('id', '')):
            clean['id'] = attrs['id']
        if emitted == 'code' and re.fullmatch(r'language-[a-z0-9+-]+', attrs.get('class', '')):
            clean['class'] = attrs['class']
        if emitted == 'a' and attrs.get('href'):
            href = urljoin('https://raulalmeidablog.substack.com/', attrs['href'])
            parsed = urlsplit(href)
            if parsed.scheme in {'https', 'http', 'mailto'}:
                if parsed.hostname in POST_HOSTS and parsed.path.startswith('/p/'):
                    slug = parsed.path.strip('/').split('/')[-1]
                    if slug in EDITORIAL:
                        href = '/p/' + slug + '/' + ('#' + parsed.fragment if parsed.fragment else '')
                elif parsed.hostname in MEDIA_HOSTS:
                    href = image_path(href)
                clean['href'] = href
            if attrs.get('target') == '_blank':
                clean.update(target='_blank', rel='noopener noreferrer')
        if emitted == 'img':
            clean = {'src': image_path(attrs['src']), 'alt': attrs.get('alt', ''), 'loading': 'lazy', 'decoding': 'async'}
            for dimension in ['width', 'height']:
                if attrs.get(dimension, '').isdigit():
                    clean[dimension] = attrs[dimension]
        if emitted in {'th', 'td'}:
            for key in ['colspan', 'rowspan']:
                if attrs.get(key, '').isdigit():
                    clean[key] = attrs[key]
        if emitted == 'ol' and re.fullmatch(r'-?\d+', attrs.get('start', '')):
            clean['start'] = attrs['start']
        self.output.append('<' + emitted + ''.join(' ' + key + '="' + html.escape(value, quote=True) + '"' for key, value in clean.items()) + '>')

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                for _, emitted, _ in reversed(self.stack[index:]):
                    if emitted:
                        self.output.append('</' + emitted + '>')
                del self.stack[index:]
                break

    def handle_data(self, data):
        if not any(entry[2] for entry in self.stack):
            self.output.append(html.escape(data, quote=False))


def download_image(url):
    path = ROOT / 'public' / image_path(url).lstrip('/')
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        with urlopen(Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=20) as response:
            if urlsplit(response.url).hostname not in MEDIA_HOSTS or not response.headers.get('Content-Type', '').startswith('image/'):
                raise ValueError('Unexpected image response')
            data = response.read()
        if not data.startswith((b'\x89PNG\r\n\x1a\n', b'\xff\xd8\xff', b'RIFF')):
            raise ValueError('Unexpected image format')
        path.write_bytes(data)
    return {'sourceUrl': url, 'localPath': image_path(url)}


def main():
    source = Path(sys.argv[1]).read_bytes()
    items = ET.fromstring(source).findall('./channel/item')
    articles = []
    image_urls = set()
    content_dir = ROOT / 'src/articles'
    content_dir.mkdir(parents=True, exist_ok=True)
    for item in items:
        source_url = item.findtext('link') or ''
        if urlsplit(source_url).hostname not in POST_HOSTS:
            raise ValueError('Unexpected or missing article source URL')
        slug = urlsplit(source_url).path.rsplit('/', 1)[-1]
        if slug not in EDITORIAL:
            raise ValueError('Review editorial metadata for new article: ' + slug)
        body = item.findtext('{http://purl.org/rss/1.0/modules/content/}encoded')
        if not body:
            raise ValueError('Missing full article body: ' + slug)
        before = SourceStructure()
        before.feed(body)
        clean = ArticleHTML()
        clean.feed(body)
        cleaned = ''.join(clean.output)
        after = SourceStructure()
        after.feed(cleaned)
        if before.blocks != after.blocks or len(before.images) != len(after.images):
            raise ValueError('Code/image preservation failed: ' + slug)
        urls = sorted({original_image(url) for url in before.images})
        image_urls.update(urls)
        language, topic, summary = EDITORIAL[slug]
        published = parsedate_to_datetime(item.findtext('pubDate') or '').astimezone(timezone.utc).isoformat().replace('+00:00', 'Z')
        articles.append({
            'slug': slug, 'title': item.findtext('title'), 'sourceUrl': source_url,
            'publishedAt': published, 'language': language, 'topic': topic, 'summary': summary,
            'seriesPosition': SERIES.index(slug) + 1 if slug in SERIES else None,
            'sourceImageCount': len(before.images), 'sourceCodeBlockCount': len(before.blocks),
            'codeBlockSha256': [digest(block) for block in before.blocks],
            'sourceBodySha256': digest(body), 'bodySha256': digest(cleaned),
            'images': [{'sourceUrl': url, 'localPath': image_path(url)} for url in urls],
        })
        (content_dir / (slug + '.html')).write_text(cleaned)
    if {a['slug'] for a in articles} != set(EDITORIAL):
        raise ValueError('Feed is incomplete; do not publish a partial import')
    with ThreadPoolExecutor(max_workers=4) as pool:
        images = list(pool.map(download_image, sorted(image_urls)))
    destination = ROOT / 'src/data/articles.json'
    destination.write_text(json.dumps(articles, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'articles': len(articles), 'uniqueImages': len(images), 'codeBlocksPreserved': sum(a['sourceCodeBlockCount'] for a in articles), 'feedSource': FEED_URL}, ensure_ascii=False))


if __name__ == '__main__':
    main()
