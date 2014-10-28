import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
export default AbstractEditRoute.extend({
    hideNewButton: true,
    newTitle: 'Address Options',
    editTitle: 'Address Options',
    model: function() {
        return new Ember.RSVP.Promise(function(resolve) {            
            this.get('store').find('config', 'address_options').then(function(address_options) {
                resolve(address_options);
            }, function() {
                var newConfig = this.get('store').push('config', {
                    id: 'address_options',
                    value: {
                        address1Label: 'Address',
                        address1Include: true
                    }
                });
                resolve(newConfig);
            }.bind(this));
        }.bind(this));
    }
});
