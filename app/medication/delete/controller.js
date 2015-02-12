import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';    
export default AbstractDeleteController.extend({
    title: 'Delete Request',
    
    actions: {
        delete: function() {
            this.removeChildFromVisit(this.get('model'), 'medication').then(function() {
                this.get('model').destroyRecord().then(function() {                    
                    this.send('closeModal');
                }.bind(this));
            }.bind(this));
        }
    }
});