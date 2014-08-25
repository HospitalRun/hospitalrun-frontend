import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    pageTitle: 'Completed',
    model: function() {
        return this.store.find('lab', {status: 'Completed'});
    }
});