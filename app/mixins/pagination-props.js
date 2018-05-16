<<<<<<< HEAD
import Ember from 'ember';
export default Ember.Mixin.create({
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
=======
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
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
