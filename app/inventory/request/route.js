import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
export default AbstractEditRoute.extend({
    editTitle: 'Edit Request',
    modelName: 'inv-request',
    newTitle: 'New Request',
    getNewData: function() {
        return {
            transactionType: 'Request'
        };
    }
});