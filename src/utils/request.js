
import {
  BASE_CMS_SERVER_URL,
  BASE_AUTH_SERVER_URL,
  BASE_OMS_SERVER_URL,
  BASE_MEMBERSHIP_SERVER_URL,
  BASE_STATIC_FILE_SERVER_URL
} from "../project.constants.js";
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
  return function(obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = res => {
        resolve(res)
      };
      obj.fail = res => {
        reject(res)
      };
      fn(obj)
    })
  }
}

/**
 * request to CMS
 * @param {*} method 
 * @param {*} uri 
 * @param {*} param2 
 */
export function requestCMS({method, uri, header, data }) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: method,
      url: BASE_CMS_SERVER_URL + uri,
      header: header,
      data: data,
       success: function (response) {
        const statusCode = parseInt(response.statusCode, 10);
        log('CMS Response Status Code:', statusCode);
        log('CMS Response:', response);
        if (statusCode !== 200) {
          log('CMS Error Code:', statusCode);
          log('CMS Erros:', response);
          //todo: Send errors to Sentry ...
        } else {
          resolve(response);
        }
       },
       fail: function (error) {
        log('CMS Erros:', response);
        //todo: Send errors to Sentry ...
        reject(error);
       }
    })
 });
}

/**
 * request to Static File Server
 * @param {*} method 
 * @param {*} uri 
 * @param {*} param2 
 */
export function requestSFS({method, uri, header, data }) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: method,
      url: BASE_STATIC_FILE_SERVER_URL + uri,
      header: header,
      data: data,
       success: function (response) {
        const statusCode = parseInt(response.statusCode, 10);
        log('SFS Response Status Code:', statusCode);
        log('SFS Response:', response);
        if (statusCode !== 200) {
          log('SFS Error Code:', statusCode);
          log('SFS Erros:', response);
          //todo: Send errors to Sentry ...
        } else {
          resolve(response);
        }
       },
       fail: function (error) {
        log('SFS Erros:', response);
        //todo: Send errors to Sentry ...
         reject(error);
       }
    })
 });
}