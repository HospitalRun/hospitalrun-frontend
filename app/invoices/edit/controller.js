import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    

export default AbstractEditController.extend({
    updateCapability: 'add_invoice',

    afterUpdate: function(record) {
        this.transitionToRoute('/invoices/search/'+record.get('id'));
    }
});
