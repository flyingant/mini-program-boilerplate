import Immutable from '../libs/immutable.min.js'
import { wxPromise, requestSFS } from '../utils/request';
import log from '../utils/logger';
import { Observable, interval, Subject, AsyncSubject,  BehaviorSubject, of, from, pipe, operators } from '../libs/rxjs.umd';
import {
  BASE_CMS_SERVER_URL,
  BASE_AUTH_SERVER_URL,
  BASE_OMS_SERVER_URL,
  BASE_MEMBERSHIP_SERVER_URL,
  BASE_STATIC_FILE_SERVER_URL,
  VERSION
} from "../project.constants.js";
const { mergeMap, flatMap } = operators;
import AppStore from './AppStore';
import {
  redirectToRequirePermissionPage
} from '../utils/navigator'

const appStore = AppStore.instance;
const ACCESS_TOKEN_KEY = BASE_AUTH_SERVER_URL + 'ACCESS_TOKEN' + VERSION;

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

const getProducts = () => {
  from(wxPromise(wx.getSetting)()).pipe(
    flatMap((data) => {
      console.log('Data', data);
      return from(wxPromise(wx.getSetting)());
    }),
    flatMap((data) => {
      console.log('Data 2:', data);
      return from(wxPromise(wx.getSetting)());
    })
  ).subscribe({
    next: (response) => {
      console.log('Response:', response)
    },
    error: () => {

    },
    complete: (c) => {
      console.log('Completed:', c)
    }
  })
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

/**
 * Get the External Configuration from static file server
 */
export function getExternalConfiguration() {
  log('Requesting External Configuration...');
  from(requestSFS({
    method: 'GET',
    uri: '/bby-cvd-lp-config.json',
    header: {},
    data: {}
  })).subscribe({
    next: (res) => {
      appStore.update({
        config: res.data
      });
    },
    error: (error) => {
      log('Erros:', error);
    },
    complete: () => {
      log('Get External Configuration Completed!');
    }
  })
}

/**
 * Request to auth API to get the auth token
 */
const auth = () => {
  from(wxPromise(wx.getUserInfo)()).pipe(
    flatMap((userInfo) => {
      return from(wxPromise(wx.login)()).pipe(
          flatMap((loginResponse) => of(Object.assign({}, loginResponse, userInfo))))
    }),
    flatMap((authParams) => {
      let token = '123';
      console.log('User Auth parameter from wechat:', authParams);
      // todo: Request our AUTH API to get the auth token
      // ...
      return of(token)
    })
  ).subscribe({
    next: (token) => {
      // todo: got the token and update the token to app store state
      log('Auth Toekn', token);
    },
    error: (error) => {
      log('Erros:', error);
    },
    complete: () => {
      log('Got Token Completed!');
    }
  });
}

/**
 * Check User Permission
 */
export function requireUserAuth() {

  from(wxPromise(wx.getSetting)()).subscribe({
    next: (response) => {
      log('User Permissions:', response);
      if (!response.authSetting['scope.userInfo']) {
        log('Navigate to Require User Permission Page!');
        redirectToRequirePermissionPage();
      } else {
        if (wx.getStorageSync(ACCESS_TOKEN_KEY)) {
          log('Check User Session ...');
          from(wxPromise(wx.checkSession)()).subscribe({
            next: () => {
              log('Session is available!');
              appStore.update({
                accessToken: wx.getStorageSync(ACCESS_TOKEN_KEY)
              });
            },
            error: () => {
              log('Session is expired!');
              auth(); // auth the user
            }
          })
        } else {
          auth(); // auth the user
        }
      }
    }
  })
}




