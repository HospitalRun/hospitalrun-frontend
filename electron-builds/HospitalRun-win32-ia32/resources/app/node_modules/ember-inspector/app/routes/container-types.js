import Ember from "ember";
const { Route, RSVP: { Promise } } = Ember;

export default Route.extend({
  model() {
    const port = this.get('port');
    return new Promise(resolve => {
      port.one('container:types', function(message) {
        resolve(message.types);
      });
      port.send('container:getTypes');
    });
  },
  actions: {
    reload() {
      this.refresh();
    }
  }
});
