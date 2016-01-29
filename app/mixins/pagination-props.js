import Ember from 'ember';
export default Ember.Mixin.create({
  paginationProps: function() {
    const paginationProperties = [
      'disableNextPage',
      'disablePreviousPage',
      'showFirstPageButton',
      'showLastPageButton',
      'showPagination'
    ];
    return this.getProperties(paginationProperties);
  }.property('disableNextPage', 'disablePreviousPage', 'showFirstPageButton', 'showLastPageButton', 'showPagination')
});
