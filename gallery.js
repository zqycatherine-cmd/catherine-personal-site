(() => {
  // Keep section navigation reliable in embedded browsers as well as normal tabs.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const hash = link.getAttribute('href');
      const target = hash === '#' ? document.querySelector('#main') : document.getElementById(hash.slice(1));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
      history.replaceState(null, '', hash);
    });
  });
  const dialog = document.querySelector('#photo-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const links = [...document.querySelectorAll('.photo-link')];
  const image = document.querySelector('#viewer-photo');
  const caption = document.querySelector('#photo-caption');
  const error = dialog.querySelector('.viewer-error');
  let current = 0;
  let opener = null;
  const showPhoto = (index) => {
    current = (index + links.length) % links.length;
    const link = links[current];
    error.hidden = true;
    image.hidden = false;
    image.alt = link.querySelector('img').alt;
    caption.textContent = link.dataset.caption;
    image.src = link.href;
  };
  image.addEventListener('error', () => { image.hidden = true; error.hidden = false; });
  links.forEach((link, index) => link.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    showPhoto(index);
    dialog.showModal();
  }));
  dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.viewer-prev').addEventListener('click', () => showPhoto(current - 1));
  dialog.querySelector('.viewer-next').addEventListener('click', () => showPhoto(current + 1));
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(current + 1); }
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => { if (opener) opener.focus({ preventScroll: true }); });
})();
