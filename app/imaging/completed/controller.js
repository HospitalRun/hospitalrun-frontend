import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
export default AbstractPagedController.extend({
    showActions: false,
    sortProperties: ['imagingDate'],
    // Sort in descending order
    sortAscending: false
});