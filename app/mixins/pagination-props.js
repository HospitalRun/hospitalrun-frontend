import Mixin from '@ember/object/mixin';
export default Mixin.create({
  paginationProps: function() {
    let paginationProperties = [
      'disableNextPage',
      'disablePreviousPage',
      'showFirstPageButton',
      'showLastPageButton',
      'showPagination'
    ];
    return this.getProperties(paginationProperties);
  }.property('disableNextPage', 'disablePreviousPage', 'showFirstPageButton', 'showLastPageButton', 'showPagination')
});
