const { ipcRenderer } = require('electron');
const ProgressBar = require('progressbar.js');

const WORK_TYPE_START_WORK = 1;
const WORK_TYPE_STOP_WORK = 2;

let switchButton = document.getElementById('switch-button');
let progressBar = new ProgressBar.Circle('#timer-container', {
  strokeWidth: 2,
  color: '#0076ce',
  trailColor: '#eee',
  trailWidth: 1,
  svgStyle: null,
});

let workTime = 1 * 10;
let restTime = 10;
let state = {
  type: WORK_TYPE_START_WORK,
  remainTime: workTime,
};
let clockTimer;

function setState(_state) {
  Object.assign(state, _state);
  render();
}

function startWork() {
  setState({
    type: WORK_TYPE_STOP_WORK,
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
    case WORK_TYPE_START_WORK:
      switchButton.innerText = '开始工作';
      break;
    case WORK_TYPE_STOP_WORK:
      switchButton.innerText = '停止工作';
      break;
  }
}

function handleTimer() {
  const { remainTime, type } = state;
  if (remainTime === 0) {
    finishWork();
    setState({
      type: WORK_TYPE_START_WORK,
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
      type: WORK_TYPE_START_WORK,
      remainTime: 0,
    });
  }
};

render();
