import {
  APP_NAME,
  VERSION,
  GA_PROXY_SERVER_URL,
  GA_TRACKER_ID
} from "../project.constants.js";
const ga = require('../libs/ga.js');
const GoogleAnalytics = ga.GoogleAnalytics;
const HitBuilders = ga.HitBuilders;

const singleton = Symbol();
const singletonEnforcer = Symbol();

class GATracker {

  constructor(enforcer) {
    if (enforcer != singletonEnforcer) throw "Cannot construct singleton";
    this.tracker = GoogleAnalytics.getInstance(this) // initialize the GA with given tracker ID
    .setAppName(APP_NAME)
    .setAppVersion(VERSION)
    .newTracker(GA_TRACKER_ID);
    this.setProxyServer(GA_PROXY_SERVER_URL); // set up the GA tracker
    console.log('GA tracker initialized ...');
  }

  static get instance() {
    if (!this[singleton]) {
      this[singleton] = new GATracker(singletonEnforcer);
    }
    return this[singleton];
  }

  setProxyServer(proxyServerURL) {
    this.tracker.setTrackerServer(proxyServerURL);
  }

  trackSource(url) {
    url = decodeURIComponent(url);
    console.log('Query URL to GA:', url);
    let HitBuilders = ga.HitBuilders;
    this.tracker.send(new HitBuilders.ScreenViewBuilder()
        .setCampaignParamsFromUrl(url)
        .build());
  }

  trackEvent(category, action, label, value) {
    let HitBuilders = ga.HitBuilders;
    this.GATracker.send(new HitBuilders.EventBuilder()
        .setCategory(category)
        .setAction(action)
        .setLabel(label)
        .setValue(value)
        .build());
  }
}

export default GATracker