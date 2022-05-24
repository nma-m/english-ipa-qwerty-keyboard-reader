/////////////
// TEXTBOX //
/////////////
function copyToClipboard() {
  const copyText = document.getElementById('textbox');
  const button = document.getElementById('copy-button')
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

  navigator.clipboard.writeText(copyText.value);

  button.style.width = '4em';
  button.innerText = 'copied';
  button.style.background = 'var(--green)';

  document.addEventListener('click', () => {
    button.innerText = 'copy';
    button.style.width = '3em';
    button.style.background = 'var(--blue)';
  }, { capture: true, once: true });

  document.addEventListener('keydown', () => {
    button.innerText = 'copy';
    button.style.width = '3em';
    button.style.background = 'var(--blue)';
  }, { capture: true, once: true });
}

///////////
// MODAL //
///////////
const modalOverlay = document.getElementById('modal-overlay');
const modalFirstElement = document.getElementById('close-about');
const modalLastElement = document.getElementById('modal-last-focusable');

// trap focus in modal
modalFirstElement.addEventListener('keydown', (e) => {
  if (e.shiftKey && e.key === 'Tab') {
    modalLastElement.focus();
    e.preventDefault();
  }
});

modalLastElement.addEventListener('keydown', (e) => {
  if (!e.shiftKey && e.key === 'Tab') {
    modalFirstElement.focus();
    e.preventDefault();
  }
});

// close modal with overlay click
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    closeAbout();
  }
});

function openAbout() {
  const modalOverlay = document.getElementById('modal-overlay');
  const firstElement = document.getElementById('close-about');

  modalOverlay.style.display = 'flex';
  firstElement.focus();

  // close modal with ESC
  document.addEventListener('keydown', closeAboutWithEsc);
}

let closeAboutWithEsc = (e) => {
  if (e.key === 'Escape') {
    closeAbout();
  }
};

function closeAbout() {
  document.removeEventListener('keydown', closeAboutWithEsc);
  document.getElementById('modal-content').scrollTo(0, 0);
  modalOverlay.style.display = 'none';
  document.getElementById('read-more').focus();
}