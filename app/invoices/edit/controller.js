import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    
import PublishStatuses from 'hospitalrun/mixins/publish-statuses';

export default AbstractEditController.extend(PublishStatuses, {
    updateCapability: 'add_invoice',

    afterUpdate: function(record) {
        this.transitionToRoute('/invoices/search/'+record.get('id'));
    }
});
