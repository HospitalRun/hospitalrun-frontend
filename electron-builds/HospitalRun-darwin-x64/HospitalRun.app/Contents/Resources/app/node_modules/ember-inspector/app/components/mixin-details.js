import Ember from "ember";
const { Component } = Ember;
export default Component.extend({
  actions: {
    traceErrors() {
      this.get('port').send('objectInspector:traceErrors', {
        objectId: this.get('model.objectId')
      });
    }
  }
});
