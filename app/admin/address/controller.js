import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from "ember";
export default AbstractEditController.extend({
    hideCancelButton: true,
    updateCapability: 'update_config', 
    
    afterUpdate: function() {        
        this.send('openModal', 'dialog', Ember.Object.create({
            title: 'Options Saved',
            message: 'The address options have been saved',
            hideCancelButton: true,
            updateButtonAction: 'ok',
            updateButtonText: 'Ok'
        }));
    }
});