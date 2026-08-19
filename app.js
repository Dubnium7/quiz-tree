let data = null;
let dodgeCount = 0;
let currentYesAction = null;
let currentNoAction = null;

const questionArea = document.getElementById('questionArea');
const endArea = document.getElementById('endArea');
const question = document.getElementById('question');
const buttonsEl = document.getElementById('buttons');
const choiceArea = document.getElementById('choiceArea');
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const endImage = document.getElementById('endImage');
const endText = document.getElementById('endText');
const btnRestart = document.getElementById('btnRestart');

const MAX_DODGE = 2;

async function init() {
  const res = await fetch('questions.json', { cache: 'no-store' });
  data = await res.json();
  showNode(data.start);
}

function typeText(el, text, done) {
  el.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    i++;
    el.textContent = text.slice(0, i);
    if (i >= text.length) {
      clearInterval(timer);
      if (done) done();
    }
  }, 110);
}

function showNode(id) {
  const node = data.nodes[id];

  if (node.type === 'end') {
    document.body.classList.toggle('fullscreen-end', !!node.fullscreen);
    questionArea.style.display = 'none';
    endArea.style.display = 'block';
    endImage.src = node.image;
    endText.textContent = node.text || '';
    return;
  }

  document.body.classList.remove('fullscreen-end');

  questionArea.style.display = 'block';
  endArea.style.display = 'none';

  if (node.type === 'choice') {
    buttonsEl.style.display = 'none';
    choiceArea.style.display = 'flex';
    choiceArea.innerHTML = '';
    const btns = [];
    node.options.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'btn choice-btn';
      b.textContent = opt.text;
      b.disabled = true;
      b.onclick = () => showNode(opt.next);
      choiceArea.appendChild(b);
      btns.push(b);
    });
    typeText(question, node.text, () => btns.forEach(b => { b.disabled = false; }));
    return;
  }

  buttonsEl.style.display = 'flex';
  choiceArea.style.display = 'none';
  btnYes.textContent = node.yesText || '有';
  btnNo.textContent = node.noText || '没有';
  currentYesAction = () => showNode(node.yes);
  currentNoAction = () => showNode(node.no);

  const yesBig = node.big !== 'no';
  btnYes.classList.toggle('btn-big', yesBig);
  btnYes.classList.toggle('btn-small', !yesBig);
  btnNo.classList.toggle('btn-big', !yesBig);
  btnNo.classList.toggle('btn-small', yesBig);

  resetDodge();

  btnYes.disabled = true;
  btnNo.disabled = true;
  typeText(question, node.text, () => {
    btnYes.disabled = false;
    btnNo.disabled = false;
  });
}

function resetDodge() {
  dodgeCount = 0;
  btnYes.style.position = '';
  btnYes.style.left = '';
  btnYes.style.top = '';
  btnNo.style.position = '';
  btnNo.style.left = '';
  btnNo.style.top = '';
}

function tryDodge(el) {
  if (!el.classList.contains('btn-small') || dodgeCount >= MAX_DODGE) return false;
  dodgeCount++;
  const card = document.getElementById('card').getBoundingClientRect();
  const maxX = Math.max(card.width - el.offsetWidth, 0);
  const maxY = Math.max(card.height - el.offsetHeight, 0);
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  el.style.position = 'fixed';
  el.style.left = card.left + x + 'px';
  el.style.top = card.top + y + 'px';
  el.style.zIndex = '99';
  el.style.transition = 'left 0.2s ease, top 0.2s ease, transform 0.2s ease';
  el.style.transform = 'rotate(-8deg)';
  return true;
}

function bindDodge(el, getAction) {
  el.addEventListener('touchstart', e => {
    if (tryDodge(el)) {
      e.preventDefault();
      el.dataset.suppress = '1';
    }
  }, { passive: false });

  el.addEventListener('click', e => {
    if (el.dataset.suppress === '1') {
      delete el.dataset.suppress;
      return;
    }
    if (!tryDodge(el)) {
      const action = getAction();
      if (action) action();
    }
  });
}

bindDodge(btnYes, () => currentYesAction);
bindDodge(btnNo, () => currentNoAction);

btnRestart.onclick = () => showNode(data.start);

init();