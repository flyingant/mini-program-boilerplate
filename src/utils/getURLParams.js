/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
module.exports = (url) => {
  url = url.split('#')[0]; // Discard fragment identifier.
  const urlParams = {};
  let queryString = url.split('?')[1];
  if (!queryString) {
    if (url.search('=') !== false) {
      queryString = url;
    }
  }
  if (queryString) {
    const keyValuePairs = queryString.split('&');
    for (let i = 0; i < keyValuePairs.length; i++) {
      const keyValuePair = keyValuePairs[i].split('=');
      const paramName = keyValuePair[0];
      const paramValue = keyValuePair[1] || '';
      urlParams[paramName] = decodeURIComponent(paramValue.replace(/\+/g, ' '));
    }
  }
  return urlParams;
};
