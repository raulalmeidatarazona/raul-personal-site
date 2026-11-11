# Production deployment

## Architecture

- Public site: `https://raulalmeida.com`; `www` redirects to the apex, preserving paths.
- Astro generates static files locally; production runs Caddy on Debian 13 in Hetzner Cloud. Node.js, npm, source code and GitHub credentials are not needed on the server.
- Only `dist/` is uploaded. No GitHub Actions build or deployment is required.
- Root directory: `/srv/raul-personal-site/current`, an atomic symlink to a timestamped directory under `/srv/raul-personal-site/releases/`.
- Caddy configuration: [`deploy/Caddyfile`](deploy/Caddyfile). Caddy manages certificate renewal. Ports 80 and 443 must remain reachable.
- SSH uses an existing key; password and interactive authentication are disabled. The host firewall defaults to deny incoming traffic, limits SSH and permits HTTP/HTTPS.
- The server address, SSH key path, host-key trust, DNS backup and release manifests are private operational state, not repository contents. No paid backup service is enabled; retain source and release archives separately.

## Manual release

Obtain the server address and approved SSH identity from the private operational record. Confirm the SSH host fingerprint before connecting. Keep the environment values outside this repository.

```sh
npm ci
npm run build
node --test tests/*.test.mjs
git diff --check

: "${SITE_HOST:?Set the approved production server}"
: "${SSH_KEY:?Set the local SSH identity path}"
RELEASE=$(date -u +%Y%m%dT%H%M%SZ)
ARCHIVE="${TMPDIR:?}/raul-personal-site-${RELEASE}.tar.gz"
tar -C dist -czf "$ARCHIVE" .
shasum -a 256 "$ARCHIVE"
scp -o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes \
  -i "$SSH_KEY" "$ARCHIVE" "root@${SITE_HOST}:/root/"
```

On the server, use the same release ID. Verify the archive checksum against the local result **before** extraction. Create a new release directory, never overwrite a previous release, and do not upload the workspace root. Validate the extracted files against the release manifest; make directories traversable and files readable by Caddy. Atomically replace `current` only after validation. Ordinary content releases do not require restarting Caddy.

Changing `deploy/Caddyfile` requires `caddy validate --config /etc/caddy/Caddyfile` before `systemctl reload caddy`. DNS, firewall, SSH, paid resources and production changes require owner approval.

## Verification and rollback

- Check HTTPS and certificate validation for both hostnames. Confirm the `www` and plain-HTTP redirects and all generated routes.
- Compare public HTML/asset hashes with the release manifest. Confirm source paths such as `/.git/config`, `/.env` and `/package.json` return 404.
- Check Caddy/SSH service health, effective SSH settings, host firewall rules and certificate renewal logs.
- DNS changes affect only the apex and `www` A records. Preserve MX, SPF, mail hosts and nameservers. Verify authoritative nameservers; cached answers may continue pointing to the old server until their original TTL expires.
- For a content rollback, atomically repoint `current` to a previously verified release. Do not delete release directories as part of normal deployment. The first release has no earlier site release on this server.
- For a DNS rollback, use the private pre-change zone backup and verify all records again. Lowering a TTL does not invalidate answers already cached.

## Article indexing remains a separate migration

Imported Substack articles retain their original canonicals and `noindex,follow`. Publishing the portfolio does not migrate Substack, subscribers or existing article URLs. Changing article indexing or redirects requires an explicit content-migration decision.
