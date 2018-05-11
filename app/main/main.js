/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, Menu, Tray } from 'electron';
import { createWindow, showWindow, getWindow, destroyWindow } from './window'
import MenuBuilder from './menu';
import path from 'path';

const isSecondInstance = app.makeSingleInstance((argv, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  const _window = getWindow()
  if (_window) {
    if (_window.isMinimized()) {
      _window.restore()
    }
    _window.focus()
  }
  // 如果是通过链接打开的应用，则添加记录
  if (argv[1]) {
    const configs = loadConfigsFromString(argv[1])
    if (configs.length) {
      addConfigs(configs)
    }
  }
})

if (isSecondInstance) {
  // cannot find module '../dialog'
  // https://github.com/electron/electron/issues/8862#issuecomment-294303518
  app.exit()
}



/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});



