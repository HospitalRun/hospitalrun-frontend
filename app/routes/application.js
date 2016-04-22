import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import Ember from 'ember';

const { inject, Route } = Ember;

var ApplicationRoute = Route.extend(ApplicationRouteMixin, {
  database: inject.service(),
  config: inject.service(),
  session: inject.service(),

  actions: {
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

  model: function(params, transition) {
    const session = this.get('session');
    const isAuthenticated = session && session.get('isAuthenticated');
    return this.get('config').setup().then(function(configs) {
      if (transition.targetName !== 'finishgauth' && transition.targetName !== 'login') {
        if (isAuthenticated) {
          return this.get('database').setup(configs)
            .catch(() => {
              // Error thrown indicates missing auth, so invalidate session.
              session.invalidate();
            });
        }
      }
    }.bind(this));
  },

  afterModel: function() {
    this.controllerFor('navigation').set('allowSearch', false);
    $('#apploading').remove();
  },

  renderModal: function(template) {
    this.render(template, {
      into: 'application',
      outlet: 'modal'
    });
  },

  sessionAuthenticated() {
    const session = this.get('session');
    const userRole = session.get('data.authenticated.role');
    this.get('store').find('user-role', userRole.dasherize()).then((userCaps) => {
      session.set('data.authenticated.userCaps', userCaps.get('capabilities'));
    }).catch(Ember.K);
    this._super();
  }

});
export default ApplicationRoute;
