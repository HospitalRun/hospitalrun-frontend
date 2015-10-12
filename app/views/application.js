import Ember from 'ember';
export default Ember.View.extend({
  currentPathDidChange: function() {
    Ember.run.next(this, function() {
      this.$('ul.nav li:has(>a.active)').addClass('active');
      this.$('ul.nav li:not(:has(>a.active))').removeClass('active');
    });
  }.observes('controller.currentPath'),

  willInsertElement: function() {
    $('#apploading').remove();
  }
});
