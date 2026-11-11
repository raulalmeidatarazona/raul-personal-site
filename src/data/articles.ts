import importedArticles from './articles.json';

export const articles = importedArticles;
export type Article = (typeof articles)[number];
export const legacySeries = articles
  .filter(article => article.seriesPosition !== null)
  .sort((a, b) => a.seriesPosition! - b.seriesPosition!);
export const featuredArticles = [legacySeries[0], legacySeries[3], articles.find(article => article.slug === 'estrategias-comprobadas-para-reducir')!];
export function articleDate(article: Article) {
  return new Intl.DateTimeFormat(article.language === 'es' ? 'es-ES' : 'en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(article.publishedAt));
}
