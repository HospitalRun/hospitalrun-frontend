import Mixin from '@ember/object/mixin';
export default Mixin.create({
  publishStatuses: [
    'Draft',
    'Published',
    'Private',
    'Archived'
  ]
});
