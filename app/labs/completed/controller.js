import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
export default AbstractPagedController.extend({
    showActions: false,
    sortProperties: ['labDate'],
    // Sort in descending order
    sortAscending: false
});