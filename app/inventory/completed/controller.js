import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
export default AbstractPagedController.extend({
    sortProperties: ['dateFulfilled'],
    // Sort in descending order
    sortAscending: false,
    
});