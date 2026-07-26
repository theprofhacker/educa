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
    return n === 1 ? '1' : String(n);
  }

  /* ---------- card template ---------- */

  function createCard(video) {
    const hasEmbed = Boolean(video.embedHtml && String(video.embedHtml).trim());
    const hasTitle = Boolean(video.title && String(video.title).trim());
    const thumbHtml = video.thumbnail
      ? `<img
          src="${escapeHtml(video.thumbnail)}"
          alt=""
          class="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />`
      : '';

    const article = document.createElement('article');
    article.className =
      'video-card group flex flex-col overflow-hidden rounded-2xl bg-x-card shadow-card transition duration-300 hover:shadow-card-hover';
    article.setAttribute('role', 'listitem');
    article.dataset.id = video.id || '';

    article.innerHTML = `
      <div class="relative aspect-video overflow-hidden video-thumb bg-x-dark">
        ${thumbHtml}
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" aria-hidden="true"></div>
        <button
          type="button"
          class="play-trigger absolute inset-0 flex items-center justify-center focus:outline-none"
          data-action="play"
          aria-label="${hasTitle ? 'Play: ' + escapeHtml(video.title) : 'Play video'}"
        >
          <span class="play-ring absolute h-16 w-16 rounded-full border-2 border-white/40 transition duration-300" aria-hidden="true"></span>
          <span
            class="play-btn relative flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-x-black shadow-lg transition duration-300"
            aria-hidden="true"
          >
            <svg class="ml-0.5 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
        ${
          hasEmbed
            ? '<span class="absolute left-3 top-3 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">Embed</span>'
            : ''
        }
      </div>

      <div class="flex flex-1 flex-col p-4 sm:p-5">
        ${
          hasTitle
            ? `<h3 class="line-clamp-2 text-base font-bold leading-snug text-white">${escapeHtml(video.title)}</h3>`
            : ''
        }
        <time class="${hasTitle ? 'mt-2' : ''} text-sm text-x-muted" datetime="">
          ${escapeHtml(video.date)}
        </time>
        <div class="mt-4 flex flex-1 items-end">
          <a
            href="${escapeHtml(video.url)}"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-x-border bg-transparent px-4 py-2.5 text-sm font-bold text-white transition hover:bg-x-hover"
          >
            Watch on X
            <svg class="h-3.5 w-3.5 text-x-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
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
      videoCount.textContent = '0';
      return;
    }

    emptyState.classList.add('hidden');
    videoCount.textContent = formatCount(videos.length);

    const fragment = document.createDocumentFragment();
    videos.forEach((video) => {
      fragment.appendChild(createCard(video));
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
