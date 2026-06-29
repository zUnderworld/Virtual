window.addEventListener('DOMContentLoaded', () => {
  const suggestion = document.querySelector('.suggestion');
  suggestion.innerHTML = `.suggestion-text {opacity: 1;}`;
  suggestion.innerHTML += `.title {opacity: 1;}`;
  setTimeout(() => {suggestion.innerHTML += `.subtitle {opacity: 1;}`;}, 600);
  setTimeout(() => {suggestion.innerHTML += `.main-text, .suggestion-button {opacity: 1;}`;}, 2100);
});

let hideKey = localStorage.getItem('hideKey') || '';
if (!window.opener && !inIframe) {window.open('../index.html', '_self')}
if (!inIframe) {
  const windowOpenerSavestate = window.opener;
  window.opener.close();
}
let values = JSON.parse(localStorage.getItem('values')) || [false, false, true, 'https://', 'Google Classroom'];

const randomNumber = Math.random();
if (0.25 > randomNumber > 0) {
  document.querySelector('.suggestion-text').innerHTML = `Someone say games? That's what we're made for.`;
  document.querySelector('.suggestion-button').innerHTML = `<a href="games.html" style="all: unset;">Games</a>`;
} else if (0.5 > randomNumber > 0.25) {
  document.querySelector('.suggestion-text').innerHTML = `Want more unblocked sites? We list them weekly.`;
  document.querySelector('.suggestion-button').innerHTML = `<a href="sitelist.html" style="all: unset;">Site List</a>`;
} else if (0.75 > randomNumber > 0.5) {
  document.querySelector('.suggestion-text').innerHTML = `Virtual missing that one feature? Find it online, unblocked.`;
  document.querySelector('.suggestion-button').innerHTML = `<a href="v-unblocker.html" style="all: unset;">V-Unblocker</a>`;
} else {
  document.querySelector('.suggestion-text').innerHTML = `Want to connect with a friend? V&#8209;Connect does that for you.`;
  document.querySelector('.suggestion-button').innerHTML = `<a href="v-connect.html" style="all: unset;">V-Connect</a>`;
}

const randomColors = ['red', 'orange', 'yellow', 'lime', 'green', 'aqua', 'darkcyan', 'blue', 'darkblue', 'blueviolet']
setInterval(() => {
  const randomColor = Math.random();
  document.querySelector('.color').innerHTML = `
    .suggestion-button {background-color: ${randomColors[String(randomColor)[3]]}; box-shadow: inset 0px 0px 10px 5px black;}
    a:hover {color: ${randomColors[String(randomColor)[3]]}}
    .suggestion-button:hover {
      background: none;
      border: solid;
      padding: 20px 56px 20px 56px;
      border-color: ${randomColors[String(randomColor)[3]]};
      color: ${randomColors[String(randomColor)[3]]};
      box-shadow: none;
      text-shadow: 0px 0px 5px ${randomColors[String(randomColor)[3]]};
    }
  `;
}, 1100);

document.addEventListener('keydown', (event) => {if (event.key === hideKey) {hide();}});

function hide() {
  if (values[2]) {document.body.innerHTML = `<img src="../images/${values[4]}.png" style="height: 100%; width: 100%; z-index: 1;">`} else {
    if (values[1]) {window.open(values[3], '_blank');}
    window.opener = windowOpenerSavestate;
    if (values[0]) {window.close();}
  }
}