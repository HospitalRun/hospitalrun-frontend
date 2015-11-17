import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    hideNewButton: true,
    pageTitle: 'Lookup Lists',
    model: function() {
        return this.store.find('lookup');
    },
        
    actions: {
        refreshLookupLists: function() {
            this.refresh();            
        }
    }
});
