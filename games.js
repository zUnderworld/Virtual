import {db} from './db.js';
import {properties} from './properties.js';

let i = 1;
db.forEach((game) => {
  const gcoin = `
    <div class="gcoin g-${i}" onclick="window.open('${game.src}', 'self')">
      <img src="images/${game.name}.png" class="igcoin">
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