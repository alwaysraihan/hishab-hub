# Deploying Hishab Hub (হিসাব হাব) to Cloudflare Workers Static Assets

Follow these exact manual steps:

1. Cloudflare dashboard -> Workers & Pages -> Create -> Import a repository -> select this GitHub repo.
2. Build command: npm run build   |   Deploy command: npx wrangler deploy
3. After deploy, the site is live on a *.workers.dev URL; every git push to main redeploys automatically.
4. Custom domain: Worker -> Settings -> Domains & Routes -> Add custom domain.
5. Submit sitemap.xml in Google Search Console.
