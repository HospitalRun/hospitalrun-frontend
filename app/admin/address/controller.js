import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
export default AbstractEditController.extend({
    hideCancelButton: true,
    updateCapability: 'update_config', 
    
    afterUpdate: function() {
        this.displayAlert('Options Saved','The address options have been saved');
    }
});