/**
 * Renders the video grid and wires lightbox / nav interactions.
 * Data lives in js/videos.js → window.VIDEOS
 */

(function () {
  'use strict';

  const grid = document.getElementById('video-grid');
  const emptyState = document.getElementById('empty-state');
  const videoCount = document.getElementById('video-count');
  const yearEl = document.getElementById('year');
  const navbar = document.getElementById('navbar');

  const lightbox = document.getElementById('lightbox');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxContent = document.getElementById('lightbox-content');
  const lightboxXLink = document.getElementById('lightbox-x-link');
  const lightboxClose = document.getElementById('lightbox-close');

  const videos = Array.isArray(window.VIDEOS) ? window.VIDEOS : [];

  /* ---------- helpers ---------- */

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function formatCount(n) {
    return String(n);
  }

  function isoDateHint(displayDate) {
    // Best-effort parse for "Mon D, YYYY" → datetime attr (empty if unknown)
    if (!displayDate) return '';
    const parsed = Date.parse(displayDate);
    if (Number.isNaN(parsed)) return '';
    return new Date(parsed).toISOString().slice(0, 10);
  }

  /* ---------- card template ---------- */

  function createCard(video, index) {
    const hasEmbed = Boolean(video.embedHtml && String(video.embedHtml).trim());
    const hasTitle = Boolean(video.title && String(video.title).trim());
    const isFeatured = index === 0;
    const datetime = isoDateHint(video.date);
    const label = hasTitle ? video.title : 'Featured video';

    const thumbHtml = video.thumbnail
      ? `<img
          src="${escapeHtml(video.thumbnail)}"
          alt="${escapeHtml(label)}"
          class="thumb-img absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          referrerpolicy="no-referrer"
        />`
      : '';

    const article = document.createElement('article');
    article.className =
      'video-card group flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-x-card shadow-card hover:shadow-card-hover' +
      (isFeatured ? ' is-featured' : '');
    article.setAttribute('role', 'listitem');
    article.dataset.id = video.id || '';

    article.innerHTML = `
      <div class="relative aspect-video overflow-hidden video-thumb">
        ${thumbHtml}
        <div class="thumb-overlay absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" aria-hidden="true"></div>

        ${
          isFeatured
            ? '<span class="absolute left-3 top-3 rounded-full border border-white/10 bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">Latest</span>'
            : ''
        }

        ${
          video.date
            ? `<time class="absolute right-3 top-3 rounded-full border border-white/10 bg-black/55 px-2.5 py-1 text-[11px] font-medium text-zinc-200 backdrop-blur-md" ${
                datetime ? `datetime="${datetime}"` : ''
              }>${escapeHtml(video.date)}</time>`
            : ''
        }

        <button
          type="button"
          class="play-trigger absolute inset-0 flex items-center justify-center focus:outline-none"
          data-action="play"
          aria-label="${hasTitle ? 'Play: ' + escapeHtml(video.title) : 'Play video'}"
        >
          <span class="play-ring absolute h-[4.25rem] w-[4.25rem] rounded-full border border-white/30" aria-hidden="true"></span>
          <span
            class="play-btn relative flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-x-black shadow-lg"
            aria-hidden="true"
          >
            <svg class="ml-0.5 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>

        ${
          hasEmbed
            ? '<span class="absolute bottom-3 left-3 rounded-md bg-x-blue/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">Embed</span>'
            : ''
        }
      </div>

      <div class="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        ${
          hasTitle
            ? `<h3 class="line-clamp-2 text-[0.95rem] font-semibold leading-snug tracking-tight text-white sm:text-base">${escapeHtml(
                video.title
              )}</h3>`
            : `<h3 class="text-[0.95rem] font-semibold leading-snug tracking-tight text-zinc-400">Untitled video</h3>`
        }

        <div class="mt-auto flex items-center justify-between gap-3 pt-1">
          <span class="text-xs text-x-faint">Watch on X</span>
          <a
            href="${escapeHtml(video.url)}"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.07]"
          >
            Open
            <svg class="h-3 w-3 text-x-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    `;

    const playBtn = article.querySelector('[data-action="play"]');
    playBtn.addEventListener('click', () => handlePlay(video));

    return article;
  }

  function handlePlay(video) {
    const hasEmbed = Boolean(video.embedHtml && String(video.embedHtml).trim());

    if (hasEmbed) {
      openLightbox(video);
      return;
    }

    if (video.url) {
      window.open(video.url, '_blank', 'noopener,noreferrer');
    }
  }

  /* ---------- lightbox ---------- */

  function openLightbox(video) {
    lightboxTitle.textContent = video.title || 'Video';
    lightboxXLink.href = video.url || 'https://x.com/theprocracker';
    lightboxContent.innerHTML = video.embedHtml;

    lightbox.hidden = false;
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    lightboxContent.innerHTML = '';
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });

  /* ---------- render ---------- */

  function render() {
    grid.innerHTML = '';

    if (!videos.length) {
      emptyState.classList.remove('hidden');
      if (videoCount) videoCount.textContent = '0';
      return;
    }

    emptyState.classList.add('hidden');
    if (videoCount) videoCount.textContent = formatCount(videos.length);

    const fragment = document.createDocumentFragment();
    videos.forEach((video, index) => {
      fragment.appendChild(createCard(video, index));
    });
    grid.appendChild(fragment);
  }

  /* ---------- chrome ---------- */

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  render();
})();
