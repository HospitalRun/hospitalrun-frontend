import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
export default AbstractEditRoute.extend({
    editTitle: 'Social Services Worksheet',
    newTitle: 'Social Services Worksheet',
    
    actions: {
        updateFamilyInfo: function(model) {
            this.controller.send('updateFamilyInfo', model);
        }
    },
    
    model: function(params) {
        return new Ember.RSVP.Promise(function(resolve) {
            return this.get('store').find('social-work', {
                patient: 'patient_'+params.patient_id
            }).then(function(model) {
                resolve(model);
            },function() {
                resolve(this.get('store').createRecord('social-work', {
                    additionalData: {},
                    patient: params.patient_id
                }));
            }.bind(this));
        }.bind(this));
    },
});