require('es6-promise').polyfill();

if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', { // eslint-disable-line
    value: (predicate) => {
      if (this === null) {
        throw new TypeError('Array.prototype.findIndex called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      const list = Object(this);
      const length = list.length >>> 0; // eslint-disable-line
      const thisArg = arguments[1];
      let value;

      for (let i = 0; i < length; i++) { // eslint-disable-line
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return i;
        }
      }
      return -1;
    },
    enumerable: false,
    configurable: false,
    writable: false
  });
}
