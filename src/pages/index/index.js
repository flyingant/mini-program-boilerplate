/* eslint-disable import/no-unresolved */
import log from '../../utils/logger';

const app = getApp();

Page({
  data: {},
  onLoad() {},

  onShow() {
    app.setActivePage(this, (state) => {
      log('Global State:', state);
      return {};
    });
  },

  onHide() {},
});
