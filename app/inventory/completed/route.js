import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    pageTitle: 'History',
    model: function() {
        return this.store.find('inv-request', {status: 'Fulfilled'});
    }
});