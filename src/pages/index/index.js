/* eslint-disable no-plusplus */
/* eslint-disable no-const-assign */
/* eslint-disable import/no-unresolved */
import log from '../../utils/logger';

const app = getApp();

Page({
  data: {},
  onLoad() {},

  onShow() {
    app.setActivePage(this, (state) => {
      log('Global State:', state);
      const { message, count } = state;
      return {
        message,
        count,
      };
    });
  },

  onTapToChangeCount() {
    let { count } = this.data;
    ++count;
    app.dispatch({
      count,
      message: `你点击了 ${count} 次`,
    });
    log('Page State:', this.data);
  },
});
