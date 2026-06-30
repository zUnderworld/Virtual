const randomColors = ['red', 'orange', 'yellow', 'lime', 'green', 'aqua', 'darkcyan', 'blue', 'darkblue', 'blueviolet'];
const hideColors = ['rgb(255, 75, 75)', 'rgb(180, 0, 0)'];
let hideKey = localStorage.getItem('hideKey') || '';
let values = JSON.parse(localStorage.getItem('values')) || [false, false, true, 'https://', 'Google Classroom'];
let i = 0;
let windowOpenerSavestate;
if (!window.opener && !inIframe) {window.open('../index.html', '_self')}
if (!inIframe) {
  windowOpenerSavestate = window.opener;
  window.opener.close();
}
setInterval(() => {
  const randomColor = Math.random();
  document.querySelector('.color').innerHTML = `
    .hide{background-color: ${hideColors[i]}; box-shadow: inset 0px 0px 10px 5px black;}
    a:hover {color: ${randomColors[String(randomColor)[3]]}}
    .hide:hover {
      background: none;
      border: solid;
      padding: 20px 56px 20px 56px;
      border-color: ${hideColors[i]};
      color: ${hideColors[i]};
      box-shadow: none;
      text-shadow: 0px 0px 5px ${hideColors[i]};
    }
  `;

  i = i ? 0 : 1;
}, 1100);

window.addEventListener('DOMContentLoaded', () => {
  const text = document.querySelector('.text');
  text.innerHTML += `.title {opacity: 1;}`;
  setTimeout(() => {text.innerHTML += `.subtitle {opacity: 1;}`;}, 600);
  setTimeout(() => {text.innerHTML += `.main-text, .hide {opacity: 1;}`;}, 2100);
});

const input = document.querySelector('.toggle');
input.value = hideKey;
input.addEventListener('keydown', (event) => {setTimeout(() => {
  input.value = event.key;
  input.blur();
  input.placeholder = input.value;
  hideKey = input.placeholder;
  localStorage.setItem('hideKey', hideKey);
}, 1);}); input.addEventListener('focus', () => {
  input.value = '';
  hideKey = '';
  if (input.placeholder !== 'Toggle Hide Key') {input.placeholder = 'Toggle Hide Key'}
});

const image = document.querySelector('.image');
const tab = document.querySelector('.tab');

image.checked = values[2];
if (values[2]) {
  const ul = document.createElement('ul');
  ul.innerHTML = `
    <li>Gmail</li>
    <li>Google Docs</li>
    <li>Google Slides</li>
    <li>New Tab</li>
    <li>Google Classroom</li>
  `;
  document.querySelector('.inputs').appendChild(ul);
  document.querySelectorAll('li').forEach((li) => {
    li.addEventListener('click', (event) => {
      document.querySelectorAll('li').forEach((li2) => {li2.style.color = 'red'});
      event.currentTarget.style.color = 'green';
      values[4] = event.currentTarget.innerText;
      localStorage.setItem('values', JSON.stringify(values));
    });
    if (li.innerText === values[4]) {li.style.color = 'green'}
  });
}

tab.checked = values[1];
if (values[1]) {
  const input = document.createElement('input');
  input.placeholder = 'Paste in a URL';
  input.classList.add('url');
  document.querySelector('.inputs').appendChild(input);
  document.querySelector('.url').addEventListener('keydown', () => {
    if (document.querySelector('.url').value.startsWith('https://')) {values[3] = document.querySelector('.url').value;} else {values[3] += document.querySelector('.url').value;}
    localStorage.setItem('values', JSON.stringify(values));
  });
}
document.querySelector('.close').checked = values[0];

image.addEventListener('change', () => {
  if (image.checked) {
    tab.checked = false;
    document.querySelector('.close').checked = false;
    values[0] = false;
    values[1] = false;
    values[2] = true;
    if (document.querySelector('.url')) {document.querySelector('.url').remove()}
    const ul = document.createElement('ul');
    ul.innerHTML = `
      <li>Gmail</li>
      <li>Google Docs</li>
      <li>Google Slides</li>
      <li>New Tab</li>
      <li>Google Classroom</li>
    `;
    document.querySelector('.inputs').appendChild(ul);
    document.querySelectorAll('li').forEach((li) => {
      li.addEventListener('click', (event) => {
        document.querySelectorAll('li').forEach((li2) => {li2.style.color = 'red'});
        event.currentTarget.style.color = 'green';
        values[4] = event.currentTarget.innerText;
        localStorage.setItem('values', JSON.stringify(values));
      });
      if (li.innerText === values[4]) {li.style.color = 'green'}
    });
  } else {
    values[2] = false;
    if (document.querySelector('ul')) {document.querySelector('ul').remove();} else {console.log(document.querySelector('ul'))}
  }
  localStorage.setItem('values', JSON.stringify(values));
});

tab.addEventListener('change', () => {
  if (tab.checked) {
    image.checked = false;
    values[1] = true;
    values[2] = false;
    if (document.querySelector('ul')) {document.querySelector('ul').remove();} else {console.log(document.querySelector('ul'))}
    const input = document.createElement('input');
    input.placeholder = 'Paste in a URL';
    input.classList.add('url');
    document.querySelector('.inputs').appendChild(input);
    document.querySelector('.url').addEventListener('keydown', () => {
      if (document.querySelector('.url').value.startsWith('https://')) {values[3] = document.querySelector('.url').value;} else {values[3] = 'https://' + document.querySelector('.url').value;}
      localStorage.setItem('values', JSON.stringify(values));
    });
  } else {
    if (document.querySelector('.url')) {document.querySelector('.url').remove()}
    values[1] = false;
  }
  localStorage.setItem('values', JSON.stringify(values));
});

document.querySelector('.close').addEventListener('change', () => {
  if (document.querySelector('.close').checked) {
    values[0] = true;
    values[2] = false;
    image.checked = false;
    if (document.querySelector('ul')) {document.querySelector('ul').remove();}
  } else {values[0] = false;}
  localStorage.setItem('values', JSON.stringify(values));
});

document.addEventListener('keydown', (event) => {if (event.key === hideKey) {hide();}});

function hide() {
  if (values[2]) {document.body.innerHTML = `<img src="../images/${values[4]}.png" style="height: 100%; width: 100%; z-index: 1;">`} else {
    if (values[1]) {window.open(values[3], '_blank');}
    window.opener = windowOpenerSavestate;
    if (values[0]) {window.close();}
  }
}

document.querySelector('.hide').addEventListener('click', () => {hide()});