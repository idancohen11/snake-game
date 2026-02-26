# Deployment Guide for GitHub Pages

## Quick Deploy Steps

### 1. Create GitHub Repository

Go to [GitHub](https://github.com/new) and create a new repository:
- Name: `snake-game` (or your preferred name)
- Make it **Public** (required for free GitHub Pages)
- **Do NOT** initialize with README, .gitignore, or license (we already have these)

### 2. Push to GitHub

```bash
cd /Users/idanc/Projects/multi-bark-pack/projects/snake-game

# Add your GitHub repo as remote (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/snake-game.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section (in the left sidebar)
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

### 4. Wait for Deployment

GitHub will build and deploy your site automatically. This usually takes 1-2 minutes.

You'll see a message: "Your site is published at `https://YOUR-USERNAME.github.io/snake-game/`"

### 5. Update README

After deployment, update the README.md with your actual GitHub Pages URL:

```bash
# Replace YOUR-USERNAME in README.md with your actual GitHub username
sed -i '' 's/your-username/YOUR-USERNAME/g' README.md
git add README.md
git commit -m "docs: Update GitHub Pages URL"
git push
```

## Verify Deployment

Visit your game at: `https://YOUR-USERNAME.github.io/snake-game/`

The game should:
- ✅ Load with neon pink animated title
- ✅ Show "START GAME" button
- ✅ Be responsive on mobile devices
- ✅ Show on-screen D-pad controls on mobile
- ✅ Work with swipe gestures on touch devices

## Troubleshooting

### Site not loading?
- Check that repository is **Public**
- Verify branch is set to `main` in Pages settings
- Wait 2-3 minutes after enabling Pages
- Clear browser cache

### Game not working?
- Open browser console (F12) to check for errors
- Verify all files pushed: `index.html`, `style.css`, `game.js`
- Check that fonts are loading (Google Fonts)

### Want to use a custom domain?
1. Add a `CNAME` file with your domain
2. Configure DNS with your domain provider
3. See [GitHub Pages custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

## Making Updates

After any changes:

```bash
git add .
git commit -m "Your change description"
git push
```

GitHub Pages will automatically rebuild and deploy (1-2 minutes).

## Performance Tips

The game is already optimized:
- Pure vanilla JS (no frameworks)
- CSS-only animations
- Fonts loaded with `display=swap`
- Canvas rendering with `image-rendering: pixelated`
- No external dependencies except Google Fonts

Enjoy your game! 🍆🎮
