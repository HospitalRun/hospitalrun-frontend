import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';    
export default AbstractDeleteController.extend({
    title: 'Delete Request',
    
    actions: {
        delete: function() {
            var visit = this.get('visit');            
            visit.get('labs').then(function(labs) {
                labs.removeObject(this.get('model'));
                visit.save().then(function() {
                    this.get('model').destroyRecord().then(function() {                    
                        this.send('closeModal');
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }
    }
});