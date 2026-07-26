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
    id: '2080601033521111043',
    title: '',
    date: 'Jul 24, 2026',
    url: 'https://x.com/theprocracker/status/2080601033521111043',
    thumbnail:
      'https://pbs.twimg.com/amplify_video_thumb/2080600936192376832/img/_thm_Lawv1UHHLj-.jpg',
  },
  {
    id: '2080260704502768125',
    title: '',
    date: 'Jul 23, 2026',
    url: 'https://x.com/theprocracker/status/2080260704502768125',
    thumbnail:
      'https://pbs.twimg.com/amplify_video_thumb/2080260609153634304/img/dXUj6Y7i2MNPHwJ7.jpg',
  },
  {
    id: '2079649397525422144',
    title: '',
    date: 'Jul 21, 2026',
    url: 'https://x.com/theprocracker/status/2079649397525422144',
    thumbnail:
      'https://pbs.twimg.com/amplify_video_thumb/2079649360837853184/img/eiEhSn5KS5YH1vrV.jpg',
  },
  {
    id: '2079648464364081248',
    title: '',
    date: 'Jul 21, 2026',
    url: 'https://x.com/theprocracker/status/2079648464364081248',
    thumbnail:
      'https://pbs.twimg.com/amplify_video_thumb/2079648427529670656/img/hKnj9HWh8ByrVB-G.jpg',
  },
  {
    id: '2079523354076234205',
    title: '',
    date: 'Jul 21, 2026',
    url: 'https://x.com/theprocracker/status/2079523354076234205',
    thumbnail:
      'https://pbs.twimg.com/amplify_video_thumb/2079523224103084032/img/vKpAPsQOEhM7wx31.jpg',
  },
  {
    id: '2079159612029431831',
    title: '',
    date: 'Jul 20, 2026',
    url: 'https://x.com/theprocracker/status/2079159612029431831',
    thumbnail:
      'https://pbs.twimg.com/amplify_video_thumb/2079159188551270400/img/WLQaqskyiUvV8sBA.jpg',
  },
];

// Expose for app.js (works with plain script tags, no bundler needed)
window.VIDEOS = videos;
