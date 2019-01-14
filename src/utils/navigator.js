import serialize from './serialize'

// navigate to destination page directly with params but withour callback
function directlyNavigateTo (url, options) {
  if (options) {
    const params = serialize(options)
    url = url + "?" + params
  }
  return wx.navigateTo({
    url,
    success: function (res) { },
    fail: function (res) { },
    complete: function (res) { },
  })
}

// navigate to destination page directly with params but withour callback
// compate to directlyNavigateTo, the destination page will have no return button
function directlyRedirectTo(url, options) {
  if (options) {
    const params = serialize(options)
    url = url + "?" + params
  }
  return wx.redirectTo({
    url,
    success: function (res) { },
    fail: function (res) { },
    complete: function (res) { },
  })
}

function directlyRelaunch(url, options) {
  if (options) {
    const params = serialize(options)
    url = url + "?" + params
  }
  return wx.reLaunch({
    url,
    success: function (res) { },
    fail: function (res) { },
    complete: function (res) { },
  })
}

export function relaunchToIndexPage(options) {
  return directlyRelaunch('/pages/index/index', options);
}

