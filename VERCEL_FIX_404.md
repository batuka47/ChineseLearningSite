# Fix Vercel 404 NOT_FOUND

Your app builds fine locally. The 404 is almost always **Vercel project settings**, not the repo.

## Do this in Vercel Dashboard

1. **Open the project**  
   [vercel.com/dashboard](https://vercel.com/dashboard) → your project (e.g. ChineseLearningSite).

2. **Settings → General**
   - **Framework Preset:** must be **Next.js**.  
     If it’s “Other” or something else, change it to **Next.js** and save.
   - **Root Directory:** leave **empty** (project root).  
     If it’s set to e.g. `app` or `frontend`, clear it.

3. **Settings → Build & Development**
   - **Build Command:** `npm run build` or leave default.
   - **Output Directory:** leave **empty** for Next.js.  
     If “Output Directory” has any value (e.g. `out`, `dist`, `.next`), **clear it**.  
     Wrong Output Directory is the most common cause of 404.
   - **Install Command:** `npm install` or leave default.

4. **Redeploy**
   - **Deployments** tab → ⋮ on latest deployment → **Redeploy** (no cache), or push a new commit.

5. **Check the URL**
   - Use the **Production** URL from the project (e.g. `https://your-project.vercel.app`).  
   - Don’t use an old or preview URL.

## Summary

| Setting           | Must be                          |
|------------------|-----------------------------------|
| Framework Preset | **Next.js**                       |
| Root Directory   | **empty**                         |
| Output Directory | **empty** (do not set for Next.js)|
| Build Command    | `npm run build` (or default)      |

After changing **Output Directory** to empty and redeploying, the 404 usually goes away.
