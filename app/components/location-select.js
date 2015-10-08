import Ember from 'ember';
export default Ember.Select.extend({
  currentLocation: null,

  _setup: function () {
    Ember.Binding.from('selection').to('currentLocation').connect(this);
  }.on('init'),

  curentLocationChanged: function () {
    Ember.run.once(this, function () {
      this.get('parentView').locationChange();
    });
  }.observes('currentLocation')

});
