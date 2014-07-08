import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    pageTitle: 'Inventory Requests',
    
    actions: {
        fulfill: function(item) {                  
            this.send('openModal', 'inventory.fulfill', item);
        }
    },
    
    model: function() {
        return this.store.find('inv-request', {status:'Requested'});
    },
});