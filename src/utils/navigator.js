/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import serialize from './serialize';

// navigate to destination page directly with params but withour callback
function directlyNavigateTo(url, options) {
  if (options) {
    const params = serialize(options);
    url = `${url}?${params}`;
  }
  return wx.navigateTo({
    url,
    success(res) {},
    fail(res) {},
    complete(res) {},
  });
}

// navigate to destination page directly with params but withour callback
// compate to directlyNavigateTo, the destination page will have no return button
function directlyRedirectTo(url, options) {
  if (options) {
    const params = serialize(options);
    url = `${url}?${params}`;
  }
  return wx.redirectTo({
    url,
    success(res) {},
    fail(res) {},
    complete(res) {},
  });
}

function directlyRelaunch(url, options) {
  if (options) {
    const params = serialize(options);
    url = `${url}?${params}`;
  }
  return wx.reLaunch({
    url,
    success(res) {},
    fail(res) {},
    complete(res) {},
  });
}

export function relaunchToIndexPage(options) {
  return directlyRelaunch('/pages/index/index', options);
}
