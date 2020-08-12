const { app, ipcMain, BrowserWindow, Notification } = require('electron');

function handleIPC() {
  ipcMain.handle('notification', async (e, otherArgs) => {
    const res = new Promise((resolve, reject) => {
      // 实例化不会进行通知
      let notification = new Notification({
        title: '番茄钟',
        body: '完成工作，休息一下吧',
        silent: false,
        timeoutType: 'default',
      });
      notification.show();
      notification.on('close', () => {
        resolve({ event: 'close' });
      });
      notification.on('click', () => {
        resolve({ event: 'click' });
      });
    });
    return res;
  });
}

let mainWindow;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // 加载index.html文件
  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  handleIPC();
  createWindow();
});
