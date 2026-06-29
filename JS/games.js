const randomColors = ['red', 'orange', 'yellow', 'lime', 'green', 'aqua', 'darkcyan', 'blue', 'darkblue', 'blueviolet'];
if (!window.opener && !inIframe) {window.open('../index.html', '_self')}
if (!inIframe) {
  const windowOpenerSavestate = window.opener;
  window.opener.close();
}
setInterval(() => {
  const randomColor = Math.random();
  document.querySelector('.color').innerHTML = `a:hover {color: ${randomColors[String(randomColor)[3]]}}`;
}, 1100);

window.addEventListener('DOMContentLoaded', () => {document.querySelector('.text').innerHTML = `.title {opacity: 1;}`});

let hideKey = localStorage.getItem('hideKey') || '';
let values = JSON.parse(localStorage.getItem('values')) || [false, false, true, 'https://', 'Google Classroom'];

document.addEventListener('keydown', (event) => {if (event.key === hideKey) {hide();}});

function hide() {
  if (values[2]) {document.body.innerHTML = `<img src="../images/${values[4]}.png" style="height: 100%; width: 100%; z-index: 1;">`} else {
    if (values[1]) {window.open(values[3], '_blank');}
    window.opener = windowOpenerSavestate;
    if (values[0]) {window.close();}
  }
}

import {db} from './db/db.js';
import {properties} from './db/properties.js';

let i = 1;
db.forEach((game) => {
  const gcoin = `
    <div class="gcoin g-${i}" onclick="if (!inIframe) {window.open('${game.src}')} else {window.parent.postMessage('${game.src2}', '*')}">
      <img src="../images/${game.name}.png" class="igcoin">
      <p class="pgcoin">${game.display}</p>
    </div>
  `;

  document.querySelector('.coins').innerHTML += `
    .g-${i}:hover {
      box-shadow: 0px 0px 5px 5px ${game.color}, inset 0px 0px 3px 3px ${game.color};
      border-color: ${game.color};
    } .g-${i} {
      margin-right: 20px;
      border-color: ${game.color2};
      box-shadow: 0px 0px 1px 1px ${game.color2}, inset 0px 0px 1px 1px ${game.color2};
      border-radius: 12px;
      border-style: solid;
      border-width: 2px;
    }
  `;

  
  
  if (properties[i-1].action) {document.querySelector('.action').innerHTML+=gcoin}
  if (properties[i-1].idle) {document.querySelector('.idle').innerHTML += gcoin}
  if (properties[i-1].multiPlayer) {document.querySelector('.multiPlayer').innerHTML += gcoin}
  if (properties[i-1].popular) {document.querySelector('.popular').innerHTML += gcoin}
  if (properties[i-1].puzzle) {document.querySelector('.puzzle').innerHTML += gcoin}
  if (properties[i-1].shooting) {document.querySelector('.shooting').innerHTML += gcoin}
  if (properties[i-1].skill) {document.querySelector('.skill').innerHTML += gcoin}
  if (properties[i-1].sports) {document.querySelector('.sports').innerHTML += gcoin}
  if (properties[i-1].strategy) {document.querySelector('.strategy').innerHTML += gcoin}
  document.querySelector('.all').innerHTML += gcoin;
  i++;
});