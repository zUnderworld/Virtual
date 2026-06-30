const randomColors = ['red', 'orange', 'yellow', 'lime', 'green', 'aqua', 'darkcyan', 'blue', 'darkblue', 'blueviolet']
setInterval(() => {
  const randomColor = Math.random();
  document.querySelector('.color').innerHTML = `.topbara:hover {color: ${randomColors[String(randomColor)[3]]}}`;
}, 1100);
window.addEventListener('DOMContentLoaded', () => {document.querySelector('.a').innerHTML = `.site {opacity: 1;}`});
let windowOpenerSavestate;
if (!window.opener && !inIframe) {window.open('../index.html', '_self')}
if (!inIframe) {
  windowOpenerSavestate = window.opener;
  window.opener.close();
}
let hideKey = localStorage.getItem('hideKey') || '';
let values = JSON.parse(localStorage.getItem('values')) || [false, false, true, 'https://', 'Google Classroom'];

document.addEventListener('keydown', (event) => {if (event.key === hideKey) {hide();}});

function hide() {
  if (!inIframe) {
    if (values[2]) {document.body.innerHTML = `<img src="../images/${values[4]}.png" style="height: 100%; width: 100%; z-index: 1;">`} else {
      if (values[1]) {window.open(values[3], '_blank');}
      window.opener = windowOpenerSavestate;
      if (values[0]) {window.close();}
    }
  }
}