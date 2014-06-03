export default Ember.Route.extend({
    model: function(params) {
        return this.store.find('patient', params.patient_id);
    }
});
