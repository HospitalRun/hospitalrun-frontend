import Ember from 'ember';
const { Controller, inject: { controller } } = Ember;

export default Controller.extend({
  application: controller()
});
