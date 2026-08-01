# @theprocracker — Featured Videos

A professional single-page showcase of top X (Twitter) video posts from **@theprocracker**. Built with HTML, Tailwind CSS (CDN), and vanilla JavaScript.

**Live site:** https://theprofhacker.github.io/educa/

## Quick start

Open `index.html` in a browser, or serve locally:

```bash
# Python
python3 -m http.server 8080

# Node (if you have npx)
npx serve .
```

Then visit `http://localhost:8080`.

## Project layout

```
.
├── index.html      # Page structure, Tailwind config, layout
├── styles.css      # Small custom styles (play hover, scrollbar, lightbox)
├── js/
│   ├── videos.js   # ← paste your posts here (data only)
│   └── app.js      # Renders cards, lightbox, nav chrome
└── README.md
```

## Adding your videos

Edit **`js/videos.js`**. Each item in the `videos` array can include:

| Field        | Required | Description |
|-------------|----------|-------------|
| `id`        | yes      | Unique string key |
| `title`     | yes      | Card title |
| `date`      | yes      | Display date (e.g. `"Mar 12, 2026"`) |
| `url`       | yes      | Post URL on X — powers **Watch on X** |
| `thumbnail` | no       | Image URL for the card media area |
| `embedHtml` | no       | Full iframe / embed HTML from X |

### Direct link only

```js
{
  id: 'post-1',
  title: 'My featured video',
  date: 'Jan 15, 2026',
  url: 'https://x.com/theprocracker/status/1234567890',
}
```

Play opens the post on X in a new tab.

### With official embed

On X: **Share → Embed post** → copy the embed code into `embedHtml`:

```js
{
  id: 'post-2',
  title: 'Live demo walkthrough',
  date: 'Feb 2, 2026',
  url: 'https://x.com/theprocracker/status/1234567891',
  embedHtml: `<iframe src="https://platform.twitter.com/embed/Tweet.html?id=1234567891" width="550" height="400" frameborder="0"></iframe>`,
}
```

Play opens an on-page lightbox with the embed. **Watch on X** always links to `url`.

## Customize

- **Bio / handle**: edit the header block in `index.html`
- **Social links**: footer icons in `index.html` (X, GitHub, email)
- **Colors**: Tailwind `theme.extend.colors.x` in the `<script>` config in `index.html`

## Notes

- Placeholder posts in `videos.js` use dummy status IDs — replace them with real post URLs.
- No build step required; Tailwind is loaded from the CDN.
