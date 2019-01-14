import Immutable from '../libs/immutable.min.js'
import { wxPromise } from '../utils/request';
import log from '../utils/logger';
import { Observable, interval, Subject, AsyncSubject,  BehaviorSubject, of, from, pipe, operators } from '../libs/rxjs.umd';
import {
  VERSION
} from "../project.constants.js";
const { mergeMap, flatMap } = operators;
import AppStore from './AppStore';
import {
  
} from '../utils/navigator'

const appStore = AppStore.instance;

/**
 * Check the user settings
 */
const checkUserSettings = () => {
  from(wxPromise(wx.getSetting)()).subscribe({
    next: (response) => {
      console.log('Get User Setting Response:', response);
    },
    error: () => {

    },
    complete: (c) => {
      console.log('Completed:', c)
    }
  })
};

const getUserInfo = (data) => {
  
}

/**
 * initialize the app
 */
export function initializeApp() {

}

/**
 * Get Device information
 */
export function getDeviceInfo() {
  log('Get Device Info ...');
  from(wxPromise(wx.getSystemInfo)()).subscribe({
    next: (res) => {
      let device = {
        pixelRatio: res.pixelRatio,
        width: res.windowWidth,
        height: res.windowHeight * res.pixelRatio
      }
      log('Device Info', device);
      appStore.update({
        device
      });
    },
    error: (error) => {
      log('Erros:', error);
    },
    complete: () => {
      log('Get Device Info Completed!');
    }
  })
}

