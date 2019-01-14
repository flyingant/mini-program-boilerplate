import {
  
} from '../../utils/navigator'
import { wxPromise } from '../../utils/request';
import { initializeApp, getDeviceInfo, getExternalConfiguration, requireUserAuth } from '../../reactivex/AppAction';
const app = getApp();

Page({
  data: {
    sceneCode: '',
    utm_medium: '',
    utm_campaign: ''
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
  },

  bindUTM_CampaignInput(e) {
    this.setData({
      utm_campaign: e.detail.value
    })
  },

  bindUTM_MediumInput(e) {
    this.setData({
      utm_medium: e.detail.value
    })
  },

  bindSceneCodeInput(e) {
    this.setData({
      sceneCode: e.detail.value
    })
  },

  onTapToSendDataToGA: function() {
    console.log('Scene Code:', this.data.sceneCode);
    console.log('utm_medium:', this.data.utm_medium);
    console.log('utm_campaign:', this.data.utm_campaign);
    let encodedTrackingURL = encodeURI(`https://ga.wiredcraft.cn/?utm_source=${this.data.sceneCode}&utm_medium=${this.data.utm_medium}&utm_campaign=${this.data.utm_campaign}`);
    app.tracker.trackSource(encodedTrackingURL);
  }
})
