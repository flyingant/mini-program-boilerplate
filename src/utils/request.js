/* eslint-disable no-tabs */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */
import { BASE_API_SERVER_URL } from '../project.constants.js';
import log from './logger';

// a wrapper to wrapper the wx.request to a promise objects
/**
 * Usage
 * wxPromise(wx.login)()
    .then(res => wxPromise(wx.requestCMS)({
		    method: 'GET',
    		uri: ",
		    data: {},
		    header: { "Content-Type": "application/json"}
    	})
    .then(res => { // 这里进行数据操作 })
 *
 * @param {*} fn
 */
export function wxPromise(fn) {
  return (obj = {}) => {
    return new Promise((resolve, reject) => {
      obj.success = (res) => {
        resolve(res);
      };
      obj.fail = (res) => {
        reject(res);
      };
      fn(obj);
    });
  };
}

/**
 * request to CMS
 * @param {*} method
 * @param {*} uri
 * @param {*} param2
 */
export function requestAPI({ method, uri, header, data }) {
  return new Promise((resolve, reject) => {
    wx.request({
      method,
      url: BASE_API_SERVER_URL + uri,
      header,
      data,
      success(response) {
        const statusCode = parseInt(response.statusCode, 10);
        log('API Server Response Status Code:', statusCode);
        log('API Server Response:', response);
        if (statusCode !== 200) {
          log('API Server Error Code:', statusCode);
          log('API Server Erros:', response);
        } else {
          resolve(response);
        }
      },
      fail(error) {
        log('API Server Erros:', error);
        reject(error);
      },
    });
  });
}
