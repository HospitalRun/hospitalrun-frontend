/**
 * Helper that returns the schema based on the name passed.
 * Looks in the `app/schemas` folder. Schemas are used to
 * define columns in lists.
 *
 * @method schemaFor
 * @param {Array} [name] First element is the name of the schema
 * @return {Object} The schema
 */
import Ember from 'ember';
const { Helper, getOwner } = Ember;
export default Helper.extend({
  compute([name]) {
    return getOwner(this).resolveRegistration(`schema:${name}`);
  }
});
