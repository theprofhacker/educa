/**
 * Renders featured + grid work and wires lightbox / nav chrome.
 * Data: js/videos.js → window.VIDEOS
 */

(function () {
  'use strict';

  const featuredSlot = document.getElementById('featured-slot');
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

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function isoDateHint(displayDate) {
    if (!displayDate) return '';
    const parsed = Date.parse(displayDate);
    if (Number.isNaN(parsed)) return '';
    return new Date(parsed).toISOString().slice(0, 10);
  }

  function padIndex(n) {
    return String(n).padStart(2, '0');
  }

  function categoryLabel(video) {
    return (video.category && String(video.category).trim()) || 'Demo';
  }

  function playOverlay(ariaLabel) {
    return `
      <button
        type="button"
        class="play-trigger absolute inset-0 flex items-center justify-center focus:outline-none"
        data-action="play"
        aria-label="${escapeHtml(ariaLabel)}"
      >
        <span class="play-ring absolute h-16 w-16 rounded-full border border-white/25 sm:h-[4.5rem] sm:w-[4.5rem]" aria-hidden="true"></span>
        <span
          class="play-btn relative flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-ink-950 shadow-lg sm:h-14 sm:w-14"
          aria-hidden="true"
        >
          <svg class="ml-0.5 h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>
    `;
  }

  function thumbBlock(video, label) {
    const img = video.thumbnail
      ? `<img
          src="${escapeHtml(video.thumbnail)}"
          alt="${escapeHtml(label)}"
          class="thumb-img absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          referrerpolicy="no-referrer"
        />`
      : '';

    return `
      <div class="relative aspect-video overflow-hidden video-thumb">
        ${img}
        <div class="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-black/10" aria-hidden="true"></div>
        ${playOverlay(label ? 'Play: ' + label : 'Play video')}
      </div>
    `;
  }

  function createFeatured(video) {
    const hasTitle = Boolean(video.title && String(video.title).trim());
    const title = hasTitle ? video.title : 'Featured video';
    const datetime = isoDateHint(video.date);
    const category = categoryLabel(video);

    const article = document.createElement('article');
    article.className = 'featured-card group';
    article.dataset.id = video.id || '';

    article.innerHTML = `
      ${thumbBlock(video, title)}
      <div class="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10">
        <div>
          <div class="flex flex-wrap items-center gap-2.5">
            <span class="inline-flex items-center rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
              Latest
            </span>
            <span class="text-[11px] font-medium uppercase tracking-[0.12em] text-mist-600">${escapeHtml(category)}</span>
          </div>
          <h3 class="mt-4 font-display text-2xl leading-snug tracking-tight text-mist-50 sm:text-3xl">
            ${escapeHtml(title)}
          </h3>
          ${
            video.summary
              ? `<p class="mt-3 max-w-md text-sm leading-relaxed text-mist-500">${escapeHtml(video.summary)}</p>`
              : `<p class="mt-3 max-w-md text-sm leading-relaxed text-mist-500">Watch the full walkthrough on the original X post.</p>`
          }
        </div>
        <div class="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-5">
          ${
            video.date
              ? `<time class="text-sm text-mist-500" ${datetime ? `datetime="${datetime}"` : ''}>${escapeHtml(
                  video.date
                )}</time>`
              : '<span></span>'
          }
          <a
            href="${escapeHtml(video.url)}"
            target="_blank"
            rel="noopener noreferrer"
            class="text-link card-cta"
          >
            Open on X
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7m10 0v10" />
            </svg>
          </a>
        </div>
      </div>
    `;

    article.querySelector('[data-action="play"]').addEventListener('click', () => handlePlay(video));
    return article;
  }

  function createCard(video, index) {
    const hasTitle = Boolean(video.title && String(video.title).trim());
    const title = hasTitle ? video.title : 'Untitled video';
    const datetime = isoDateHint(video.date);
    const category = categoryLabel(video);
    const n = padIndex(index + 1);

    const article = document.createElement('article');
    article.className = 'video-card group';
    article.setAttribute('role', 'listitem');
    article.dataset.id = video.id || '';

    article.innerHTML = `
      ${thumbBlock(video, title)}
      <div class="flex flex-1 flex-col gap-4 p-5">
        <div class="flex items-start justify-between gap-3">
          <span class="text-[11px] font-medium tabular-nums tracking-wide text-mist-600">${n}</span>
          <span class="text-[11px] font-medium uppercase tracking-[0.12em] text-mist-600">${escapeHtml(category)}</span>
        </div>
        <h3 class="line-clamp-2 text-[0.95rem] font-semibold leading-snug tracking-tight text-mist-50 sm:text-base">
          ${escapeHtml(title)}
        </h3>
        <div class="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
          ${
            video.date
              ? `<time class="text-xs text-mist-500" ${datetime ? `datetime="${datetime}"` : ''}>${escapeHtml(
                  video.date
                )}</time>`
              : '<span></span>'
          }
          <a
            href="${escapeHtml(video.url)}"
            target="_blank"
            rel="noopener noreferrer"
            class="text-link card-cta text-xs"
          >
            Open
            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7m10 0v10" />
            </svg>
          </a>
        </div>
      </div>
    `;

    article.querySelector('[data-action="play"]').addEventListener('click', () => handlePlay(video));
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

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox();
  });

  function render() {
    if (featuredSlot) featuredSlot.innerHTML = '';
    if (grid) grid.innerHTML = '';

    if (!videos.length) {
      if (emptyState) emptyState.classList.remove('hidden');
      if (videoCount) videoCount.textContent = '0';
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (videoCount) videoCount.textContent = String(videos.length);

    const [featured, ...rest] = videos;

    if (featuredSlot && featured) {
      featuredSlot.appendChild(createFeatured(featured));
    }

    if (grid) {
      const fragment = document.createDocumentFragment();
      rest.forEach((video, index) => {
        // Number remaining items as 02, 03... (featured is 01 conceptually)
        fragment.appendChild(createCard(video, index + 1));
      });
      grid.appendChild(fragment);
    }
  }

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  render();
})();
