import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
export default Mixin.create({
  paginationProps: computed('disableNextPage', 'disablePreviousPage', 'showFirstPageButton', 'showLastPageButton', 'showPagination', function() {
    let paginationProperties = [
      'disableNextPage',
      'disablePreviousPage',
      'showFirstPageButton',
      'showLastPageButton',
      'showPagination'
    ];
    return this.getProperties(paginationProperties);
  })
});
