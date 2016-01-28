import Ember from "ember";
var ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
    use_google_auth: false,

    actions: {
        authenticateSession: function() {
            if (this.use_google_auth) {
                window.location.replace('/auth/google');
            } else {
                this._super();
            }
        },
        closeModal: function() {
            this.disconnectOutlet({
                parentView: 'application',
                outlet: 'modal'
            });
        },
        /**
         * Render a modal using the specifed path and optionally set a model.
         * @param modalPath the path to use for the controller and template.
         * @param model (optional) the model to set on the controller for the modal.
         */
        openModal: function(modalPath, model) {
            if (model) {
                this.controllerFor(modalPath).set('model', model);
            }
            this.renderModal(modalPath);
        },
        /**
         * Update an open modal using the specifed model.
         * @param modalPath the path to use for the controller and template.
         * @param model (optional) the model to set on the controller for the modal.
         */
        updateModal: function(modalPath, model) {
            this.controllerFor(modalPath).set('model', model);
        }
    },

    model: function() {
        return this.store.find('config');
    },

    afterModel: function(resolvedModel) {
        this.controllerFor('navigation').set('allowSearch',false);
        if (resolvedModel) {
            var use_google_auth = resolvedModel.findBy('id','use_google_auth');
            if (use_google_auth) {
                this.use_google_auth = use_google_auth.get('value');
            }
        }
    },

    renderModal: function(template) {
        this.render(template, {
            into: 'application',
            outlet: 'modal'
        });
    },

});
export default ApplicationRoute;
