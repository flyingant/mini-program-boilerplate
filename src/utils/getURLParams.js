module.exports = (url) => {
  var url = url.split('#')[0] // Discard fragment identifier.
  var urlParams = {}
  var queryString = url.split('?')[1]
  if (!queryString) {
    if (url.search('=') !== false) {
      queryString = url
    }
  }
  if (queryString) {
    var keyValuePairs = queryString.split('&')
    for (var i = 0; i < keyValuePairs.length; i++) {
      var keyValuePair = keyValuePairs[i].split('=')
      var paramName = keyValuePair[0]
      var paramValue = keyValuePair[1] || ''
      urlParams[paramName] = decodeURIComponent(paramValue.replace(/\+/g, ' '))
    }
  }
  return urlParams
}