import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    pageTitle: 'Patient Report',

    model: function() {
        return this.store.find('visit');
    }

});
