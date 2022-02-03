function copyToClipboard() {
  const copyText = document.getElementById("textbox");
  const button = document.getElementById("copy-button")

  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

  navigator.clipboard.writeText(copyText.value);

  button.style.width = "4em";
  button.innerText = "copied";
  button.style.background = "rgb(52, 199, 89)";
  button.style.color = "white";

  window.addEventListener('click', () => {
    button.innerText = "copy";
    button.style.width = "3em";
    button.style.background = "rgb(174, 174, 178)";
    button.style.color = "black";
  }, { capture: true, once: true });

  window.addEventListener('keydown', () => {
    button.innerText = "copy";
    button.style.width = "3em";
    button.style.background = "rgb(174, 174, 178)";
    button.style.color = "black";
  }, { capture: true, once: true });
}

function openAbout() {
  document.getElementById("myModal").style.display = "flex";
}

function closeAbout() {
  document.getElementById("myModal").style.display = "none";
}