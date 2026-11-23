# Deploy Interface Formulas to GitHub Pages

GitHub account: `biomathcode`.
Suggested repository: `interface-formulas` (public).

1. Create a **public** repository named `interface-formulas` at https://github.com/new. Do not initialize it with a README, .gitignore or license if uploading with git locally.
2. From this folder:

   ```bash
   git init
   git branch -M main
   git add .
   git commit -m "Launch Interface Formulas"
   git remote add origin https://github.com/biomathcode/interface-formulas.git
   git push -u origin main
   ```

3. Open https://github.com/biomathcode/interface-formulas/settings/pages and select **GitHub Actions** as the build and deployment source.
4. Open the repository's Actions tab and inspect the "Deploy static site to GitHub Pages" workflow. If the initial run failed before Pages was configured, use **Run workflow** to deploy.
5. Expected URL once GitHub reports a successful deployment: https://biomathcode.github.io/interface-formulas/

This is a dependency-free static site: `index.html`, `styles.css`, `app.js`, `data.js`, `recipes.json` and `favicon.svg` are deployed from the repository root.
