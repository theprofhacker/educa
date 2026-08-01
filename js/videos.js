/**
 * =============================================================================
 * VIDEO DATA — paste your X posts here
 * =============================================================================
 *
 * Each entry supports:
 *
 *   id          (string, required)  Unique key for the card
 *   title       (string, required)  Card heading (can be empty "")
 *   date        (string, required)  Display date, e.g. "Mar 12, 2026"
 *   url         (string, required)  Link to the post on X (used by "Watch on X")
 *   thumbnail   (string, optional)  Original X video poster / thumb URL
 *   embedHtml   (string, optional)  Full X embed iframe HTML from "Embed post"
 *                                   When present, the play button opens a lightbox
 *                                   with this embed. Without it, play goes to `url`.
 *
 * HOW TO ADD A VIDEO
 * ------------------
 * 1. Open the post on X → Share → Embed post → copy the iframe (or use the post URL).
 * 2. For thumbnails, use the amplify_video_thumb image from the post media.
 * 3. Push a new object into the array below.
 *
 * =============================================================================
 */

const videos = [
  {
    id: '2083674380518006837',
    title: '',
    date: 'Aug 1, 2026',
    url: 'https://x.com/theprocracker/status/2083674380518006837',
    thumbnail:
      'https://pbs.twimg.com/amplify_video_thumb/2083674288549474304/img/FA9jtXiCF7ycZBDl.jpg?format=jpg&name=orig',
  },
  {
    id: '2083313276893401256',
    title: '',
    date: 'Jul 31, 2026',
    url: 'https://x.com/theprocracker/status/2083313276893401256',
    thumbnail:
      'https://pbs.twimg.com/amplify_video_thumb/2083313110429978625/img/SsGKRRttiMZf2YuM.jpg?format=jpg&name=orig',
  },
  {
    id: '2083157793415016916',
    title: '',
    date: 'Jul 31, 2026',
    url: 'https://x.com/theprocracker/status/2083157793415016916',
    thumbnail:
      'https://pbs.twimg.com/amplify_video_thumb/2083157605183098880/img/z4XzdkTB3H7--Ukp.jpg?format=jpg&name=orig',
  },
  {
    id: '2082796572304113976',
    title: '',
    date: 'Jul 30, 2026',
    url: 'https://x.com/theprocracker/status/2082796572304113976',
    thumbnail:
      'https://pbs.twimg.com/amplify_video_thumb/2082796526904958976/img/bUM40xMHU_CLeJcN.jpg?format=jpg&name=orig',
  },
  {
    id: '2082460139475378200',
    title: '',
    date: 'Jul 29, 2026',
    url: 'https://x.com/theprocracker/status/2082460139475378200',
    thumbnail:
      'https://pbs.twimg.com/amplify_video_thumb/2082460018100592641/img/AZETfIWxz12fS2lf.jpg?format=jpg&name=orig',
  },
  {
    id: '2082429799981514833',
    title: '',
    date: 'Jul 29, 2026',
    url: 'https://x.com/theprocracker/status/2082429799981514833',
    thumbnail:
      'https://pbs.twimg.com/amplify_video_thumb/2082429544187793408/img/-WkxmULO1C40BdMY.jpg?format=jpg&name=orig',
  },
];

// Expose for app.js (works with plain script tags, no bundler needed)
window.VIDEOS = videos;
