import {
  
} from '../../utils/navigator'
import { wxPromise } from '../../utils/request';
import { initializeApp, getDeviceInfo, getExternalConfiguration, requireUserAuth } from '../../reactivex/AppAction';
const app = getApp();

Page({
  data: {
    
  },
  onLoad: function (queries) {
    initializeApp();
    getDeviceInfo();
    // getExternalConfiguration();
    // requireUserAuth();
    // tracking the UTM tag from qrcode or other sources, moment ad etc.
    if (queries.q) {
      app.tracker.trackSource(queries.q);
    }
  },
  
  onShow: function() {
    // app.appStore.connect(this); 
    app.appStore.bind(['app']).connect(this);
    console.log('Page data:', this.data);
  },

  onHide: function() {
    app.appStore.disconnect();
  }
})
