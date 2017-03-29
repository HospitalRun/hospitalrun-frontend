/**
 * Service that manages local storage. This service is useful because
 * it abstracts serialization and parsing of json.
 *
 * @class Local
 * @extends Service
 */
import Ember from 'ember';
const { Service, isNone } = Ember;
const { parse, stringify } = JSON;

export default Service.extend({
  /**
   * Reads a stored json string and parses it to
   * and object.
   *
   * @method getItem
   * @param  {String} key The cache key
   * @return {Object}     The json value
   */
  getItem(key) {
    let json = localStorage.getItem(key);
    return json && parse(json);
  },

  /**
   * Serializes an object into a json string
   * and stores it in local storage.
   *
   * @method setItem
   * @param {String} key The cache key
   * @param {Object} value The object
   */
  setItem(key, value) {
    if (!isNone(value)) {
      value = stringify(value);
    }
    return localStorage.setItem(key, value);
  },

  /**
   * Deletes an entry from local storage.
   *
   * @method removeItem
   * @param  {String} key The cache key
   */
  removeItem(key) {
    return localStorage.removeItem(key);
  },

  /**
   * Returns the list keys of saved entries in local storage.
   *
   * @method keys
   * @return {Array}  The array of keys
   */
  keys() {
    let keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      keys.push(localStorage.key(i));
    }
    return keys;
  }
});
