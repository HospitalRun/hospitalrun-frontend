import Mixin from '@ember/object/mixin';
export default Mixin.create({
  canEdit: function() {
    let status = this.get('status');
    return (status === 'Requested');
  }.property('status')
});
