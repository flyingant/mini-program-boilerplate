/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
const serialize = (obj, prefix) => {
  const str = [];
  let p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? `${prefix}[${p}]` : p;
      const v = obj[p];
      str.push(
        v !== null && typeof v === 'object'
          ? serialize(v, k)
          : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`,
      );
    }
  }
  return str.join('&');
};

export default serialize;
