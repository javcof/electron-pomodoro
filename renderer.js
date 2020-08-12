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
let state = {};
let clockTimer;

function setState(_state) {
  Object.assign(state, _state);
  render();
}

function startWork() {
  setState({
    type: 1,
    remainTime: workTime,
  });
}

function finishWork() {
  clearInterval(clockTimer);
  ipcRenderer.invoke('notification', { a: 'a', b: 'b' }).then((res) => {
    console.log(res.event);
  });
}

function render() {
  const { remainTime } = state;
  progressBar.set(1 - remainTime / workTime);
  progressBar.setText(remainTime);
}

switchButton.onclick = () => {
  startWork();

  clockTimer = setInterval(() => {
    const { remainTime } = state;
    if (remainTime === 0) {
      finishWork();
    }
    setState({
      type: 1,
      remainTime: remainTime > 0 ? remainTime - 1 : 0,
    });
  }, 1000);
};
