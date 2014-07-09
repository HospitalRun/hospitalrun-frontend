export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    editTitle: null,
    newTitle: null,
    setupController: function(controller, model) {
        var sectionDetails = {};
        if (model.get('isNew')) {
            sectionDetails.currentScreenTitle = this.get('newTitle');
        } else {
            sectionDetails.currentScreenTitle = this.get('editTitle');
        }
        this.send('setSectionHeader', sectionDetails);
        this._super(controller, model);
    }
});