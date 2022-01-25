function copyToClipboard() {
  const copyText = document.getElementById("textbox");

  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

  navigator.clipboard.writeText(copyText.value);

  const toolTipText = document.getElementById("tooltiptext");
  toolTipText.style.visibility = 'visible';
  toolTipText.style.opacity = '1';

  document.addEventListener('click', () => {
    toolTipText.style.visibility = 'hidden';
    toolTipText.style.opacity = '0';
  }, { capture: true, once: true });

  document.addEventListener('keydown', () => {
    toolTipText.style.visibility = 'hidden';
    toolTipText.style.opacity = '0';
  }, { capture: true, once: true });
}