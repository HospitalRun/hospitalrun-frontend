import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
export default AbstractEditRoute.extend({
    editTitle: 'Edit User',
    modelName: 'user',
    newTitle: 'New User',

    afterModel: function() {
        this.set('users', this.modelFor('users'));
    },

    setupController: function(controller, model) {
        this._super(controller, model);
        controller.set('users', this.get('users'));        
    }
});