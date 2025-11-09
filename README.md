This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## WakaTime configuration (Dev Work page)

This project can show your WakaTime coding activity on the Dev Work page using the WakaTime public API safely from the server.

Set the following environment variables (for local dev, add them to a `.env.local` file):

- `WAKATIME_USERNAME` (required) — your public WakaTime username (e.g. `chicco`).
- `WAKATIME_SHARE_ID` (recommended) — the share UUID from a WakaTime embeddable JSON you create at https://wakatime.com/share. This avoids using secrets and works on public sites.
- `WAKATIME_API_KEY` (optional) — your secret API key. Only used server-side as a fallback when a share id isn’t set.

The client component fetches from a server route at `/api/wakatime/stats?range=last_7_days&limit=5`, which pulls from the configured source, normalizes the payload, applies caching, and returns:

```
{
	languages: Array<{ name: string; percent: number; text: string; total: string }>,
	total_time: string,
	range: string
}
```

Notes:
- Never put your WakaTime API key in client-side code. Use `WAKATIME_SHARE_ID` for public pages, or keep `WAKATIME_API_KEY` server-only.
- If you don’t configure either `WAKATIME_SHARE_ID` or `WAKATIME_API_KEY`, the page will show a friendly fallback sample.

### Debug e troubleshooting

Puoi verificare l’endpoint locale con curl (dev server su http://localhost:3000):

```bash
curl -i "http://localhost:3000/api/wakatime/stats?range=last_7_days&limit=5"
```

Esiti comuni:

- 400 Bad Request + `{ "error": "Missing WAKATIME_USERNAME..." }`
	- Aggiungi `WAKATIME_USERNAME` in `.env.local` e riavvia il dev server.

- 502 Bad Gateway + messaggio tipo "Unable to fetch WakaTime stats..."
	- Aggiungi `WAKATIME_SHARE_ID` (consigliato) creando un Embeddable JSON da https://wakatime.com/share, oppure usa `WAKATIME_API_KEY` (solo lato server). Riavvia il dev server dopo aver impostato le variabili.

Se tutto è configurato correttamente, otterrai 200 e un JSON con shape:

```json
{
	"languages": [
		{ "name": "TypeScript", "percent": 35, "text": "45h 32m", "total": "45h 32m" }
	],
	"total_time": "123h 45m",
	"range": "last_7_days"
}
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
