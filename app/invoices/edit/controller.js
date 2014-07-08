import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    

export default AbstractEditController.extend({
    afterUpdate: function(record) {
        this.transitionToRoute('/invoices/search/'+record.get('id'));
    }
});
