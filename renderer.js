const { ipcRenderer } = require('electron');
const ProgressBar = require('progressbar.js');

const switchButton = document.getElementById('switch-button');
const progressBar = new ProgressBar.Circle('#timer-container', {
  strokeWidth: 2,
  color: '#0076ce',
  trailColor: '#eee',
  trailWidth: 1,
  svgStyle: null,
});

let workTime = 1 * 10;
let restTime = 10;
let state = {
  type: 1,
  remainTime: workTime,
};
let clockTimer;

function setState(_state) {
  Object.assign(state, _state);
  render();
}

function startWork() {
  setState({
    type: 2,
    remainTime: workTime,
  });
}

function finishWork() {
  clearInterval(clockTimer);
  ipcRenderer.send('notification');
}

function render() {
  const { remainTime, type } = state;
  const ss = (remainTime % 60).toFixed(0).padStart(2, 0);
  const mm = ((remainTime - ss) / 60).toFixed(0).padStart(2, 0);
  progressBar.set(1 - remainTime / workTime);
  progressBar.setText(`${mm}:${ss}`);

  switch (type) {
    case 1:
      switchButton.innerText = '开始工作';
      break;
    case 2:
      switchButton.innerText = '停止工作';
      break;
    case 3:
      switchButton.innerText = '暂停工作';
      break;
  }
}

function handleTimer() {
  const { remainTime, type } = state;
  if (remainTime === 0) {
    finishWork();
    setState({
      type: 1,
    });
  }
  setState({
    remainTime: remainTime > 0 ? remainTime - 1 : 0,
  });
}

switchButton.onclick = () => {
  if (switchButton.innerText === '开始工作') {
    startWork();
    clockTimer = setInterval(handleTimer, 1000);
  } else if (switchButton.innerText === '停止工作') {
    setState({
      type: 1,
      remainTime: 0,
    });
  }
};

render();
