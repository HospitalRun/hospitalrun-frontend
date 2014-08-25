import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    pageTitle: 'Completed Requests',
    model: function() {
        return this.store.find('medication', {status: 'Fulfilled'});
    }
});