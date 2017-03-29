/* eslint no-empty:0 */
import Ember from "ember";
export default Ember.Route.extend({
  renderTemplate() {
    this.render();
    try {
      this.render(`${this.get('routeName').replace(/\./g, '/')}-toolbar`, {
        into: 'application',
        outlet: 'toolbar'
      });
    } catch (e) {}
  }
});
