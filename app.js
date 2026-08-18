let data = null;

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

async function init() {
  const res = await fetch('questions.json', { cache: 'no-store' });
  data = await res.json();
  showNode(data.start);
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
  question.textContent = node.text;

  if (node.type === 'choice') {
    buttonsEl.style.display = 'none';
    choiceArea.style.display = 'flex';
    choiceArea.innerHTML = '';
    node.options.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'btn choice-btn';
      b.textContent = opt.text;
      b.onclick = () => showNode(opt.next);
      choiceArea.appendChild(b);
    });
    return;
  }

  buttonsEl.style.display = 'flex';
  choiceArea.style.display = 'none';
  btnYes.textContent = node.yesText || '有';
  btnNo.textContent = node.noText || '没有';
  btnYes.onclick = () => showNode(node.yes);
  btnNo.onclick = () => showNode(node.no);

  const yesBig = node.big !== 'no';
  btnYes.classList.toggle('btn-big', yesBig);
  btnYes.classList.toggle('btn-small', !yesBig);
  btnNo.classList.toggle('btn-big', !yesBig);
  btnNo.classList.toggle('btn-small', yesBig);
}

btnRestart.onclick = () => showNode(data.start);

init();