/**
 * =============================================================================
 * VIDEO DATA — featured work for the portfolio
 * =============================================================================
 *
 * Fields:
 *   id          (string, required)
 *   title       (string, required)
 *   date        (string, required)  e.g. "Mar 12, 2026"
 *   url         (string, required)  X post URL
 *   thumbnail   (string, optional)  Original amplify_video_thumb URL
 *   category    (string, optional)  Short label (Demo, Tooling, …)
 *   summary     (string, optional)  One-line description for featured card
 *   embedHtml   (string, optional)  X embed iframe for lightbox playback
 *
 * First item is rendered as the large featured piece.
 * =============================================================================
 */

const videos = [
  {
    id: '2083674380518006837',
    title: 'Switch Between Themes — Grok Build',
    date: 'Aug 1, 2026',
    category: 'Workflow',
    summary: 'A clean walkthrough of theme switching inside Grok Build.',
    url: 'https://x.com/theprocracker/status/2083674380518006837',
    thumbnail:
      'https://pbs.twimg.com/amplify_video_thumb/2083674288549474304/img/FA9jtXiCF7ycZBDl.jpg?format=jpg&name=orig',
  },
  {
    id: '2083313276893401256',
    title: 'InstaBrute v2.0 — Kali Linux',
    date: 'Jul 31, 2026',
    category: 'Tooling',
    url: 'https://x.com/theprocracker/status/2083313276893401256',
    thumbnail:
      'https://pbs.twimg.com/amplify_video_thumb/2083313110429978625/img/SsGKRRttiMZf2YuM.jpg?format=jpg&name=orig',
  },
  {
    id: '2083157793415016916',
    title: 'BruteForce Snapchat Password',
    date: 'Jul 31, 2026',
    category: 'Demo',
    url: 'https://x.com/theprocracker/status/2083157793415016916',
    thumbnail:
      'https://pbs.twimg.com/amplify_video_thumb/2083157605183098880/img/z4XzdkTB3H7--Ukp.jpg?format=jpg&name=orig',
  },
  {
    id: '2082796572304113976',
    title: 'MailRecon 2.0 — Kali Linux 2026.2',
    date: 'Jul 30, 2026',
    category: 'Tooling',
    url: 'https://x.com/theprocracker/status/2082796572304113976',
    thumbnail:
      'https://pbs.twimg.com/amplify_video_thumb/2082796526904958976/img/bUM40xMHU_CLeJcN.jpg?format=jpg&name=orig',
  },
  {
    id: '2082460139475378200',
    title: 'NetUnix 5.0 — Update & Upgrade Tool',
    date: 'Jul 29, 2026',
    category: 'Systems',
    url: 'https://x.com/theprocracker/status/2082460139475378200',
    thumbnail:
      'https://pbs.twimg.com/amplify_video_thumb/2082460018100592641/img/AZETfIWxz12fS2lf.jpg?format=jpg&name=orig',
  },
  {
    id: '2082429799981514833',
    title: 'Monitoring System Tools in Kali Linux',
    date: 'Jul 29, 2026',
    category: 'Systems',
    url: 'https://x.com/theprocracker/status/2082429799981514833',
    thumbnail:
      'https://pbs.twimg.com/amplify_video_thumb/2082429544187793408/img/-WkxmULO1C40BdMY.jpg?format=jpg&name=orig',
  },
];

window.VIDEOS = videos;
