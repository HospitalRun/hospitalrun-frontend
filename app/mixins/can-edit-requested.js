import Ember from 'ember';
export default Ember.Mixin.create({
  canEdit: function() {
    let status = this.get('status');
    return (status === 'Requested');
  }.property('status')
});
