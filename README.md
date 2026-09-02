git# Anthony Obot Portfolio (React)

This repository now contains:

- React app (deploy target): project root
- Legacy static website backup: `legacy-static-site/`

## Run React app locally

```bash
npm install
npm run dev
```

## Build and preview

```bash
npm run build
npm run preview
```

## Deploy to Vercel

### Option 1: Vercel dashboard (recommended)

1. Push this repo to GitHub.
2. In Vercel, click **Add New Project** and import this repo.
3. Vercel should auto-detect Vite settings from `vercel.json`.
4. Click **Deploy**.

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

## Legacy website backup

The old HTML/CSS/JS version is fully preserved in:

- `legacy-static-site/`

To run it directly, open:

- `legacy-static-site/index.html`
