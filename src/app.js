import GATrackerUtils from "./utils/GATrackerUtils";
import log from './utils/logger';
import AppStore from "./reactivex/AppStore"
import { getDeviceInfo } from "./reactivex/AppAction";

App({

  appStore: null,

  tracker: null,

  onLaunch: function (queries) {
    log('App launch Queries:', queries); //todo: we need to track all scene code and sent it to GA
    this.appStore = AppStore.instance;
    this.tracker = GATrackerUtils.instance;
  }
})