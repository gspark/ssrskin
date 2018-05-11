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
import { createWindow, showWindow, getWindow, destroyWindow } from './window';
import bootstrap from './bootstrap';
import { isMac, isWin } from '../shared/env';
import { isQuiting, appConfig$, currentConfig, addConfigs } from './data';

const isSecondInstance = app.makeSingleInstance((argv, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  const _window = getWindow();
  if (_window) {
    if (_window.isMinimized()) {
      _window.restore();
    }
    _window.focus();
  }
  // 如果是通过链接打开的应用，则添加记录
  if (argv[1]) {
    const configs = loadConfigsFromString(argv[1]);
    if (configs.length) {
      addConfigs(configs);
    }
  }
})

if (isSecondInstance) {
  // cannot find module '../dialog'
  // https://github.com/electron/electron/issues/8862#issuecomment-294303518
  app.exit();
}

bootstrap.then(() => {
  createWindow();
  if (isWin || isMac) {
    app.setAsDefaultProtocolClient('ssr')
    app.setAsDefaultProtocolClient('ss')
  }

  if (process.env.NODE_ENV !== 'development') {
    checkUpdate();
  }

  // // 开机自启动配置
  // const AutoLauncher = new AutoLaunch({
  //   name: 'ShadowsocksR Client',
  //   isHidden: true,
  //   mac: {
  //     useLaunchAgent: true
  //   }
  // })

  appConfig$.subscribe(data => {
    const [appConfig, changed] = data;
    if (!changed.length) {
      // 初始化时没有配置则打开页面，有配置则不显示主页面
      if (!appConfig.configs.length || !appConfig.ssrPath) {
        showWindow();
      }
    }
    // if (!changed.length || changed.indexOf('autoLaunch') > -1) {
    //   // 初始化或者选项变更时
    //   AutoLauncher.isEnabled().then(enabled => {
    //     // 状态不相同时
    //     if (appConfig.autoLaunch !== enabled) {
    //       return AutoLauncher[appConfig.autoLaunch ? 'enable' : 'disable']().catch(() => {
    //         logger.error(`${appConfig.autoLaunch ? '执行' : '取消'}开机自启动失败`)
    //       })
    //     }
    //   }).catch(() => {
    //     logger.error('获取开机自启状态失败')
    //   })
    // }
  });

  // // 电源状态检测
  // powerMonitor.on('suspend', () => {
  //   // 系统挂起时
  //   if (process.env.NODE_ENV === 'development') {
  //     console.log('power suspend');
  //   }
  //   stopTask();
  //   setProxyToNone();
  //   stopCommand(true);
  // }).on('resume', () => {
  //   // 恢复
  //   if (process.env.NODE_ENV === 'development') {
  //     console.log('power resumed');
  //   }
  //   runWithConfig(currentConfig);
  //   startProxy();
  //   startTask(currentConfig);
  // });
});


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



