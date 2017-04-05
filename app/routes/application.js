import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import Ember from 'ember';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import SetupUserRole from 'hospitalrun/mixins/setup-user-role';
import UnauthorizedError from 'hospitalrun/utils/unauthorized-error';

const { get, inject, isEmpty, Route, set } = Ember;

const TRANSITION_AFTER_LOGIN = 'transitionAfterLogin';

let ApplicationRoute = Route.extend(ApplicationRouteMixin, ModalHelper, SetupUserRole, {
  database: inject.service(),
  config: inject.service(),
  session: inject.service(),
  shouldSetupUserRole: true,

  actions: {
    closeModal() {
      this.render('empty', {
        outlet: 'modal',
        into: 'application'
      });
    },

    error(reason, transition) {
      if (reason instanceof UnauthorizedError) {
        let i18n = this.get('i18n');
        let message = i18n.t('application.messages.sessionExpired');
        let session = get(this, 'session');
        let title = i18n.t('application.titles.sessionExpired');
        if (!isEmpty(transition)) {
          let sessionStore = session.get('store');
          let sessionData = session.get('data');
          let transitionName;
          if (transition.targetName) {
            transitionName = transition.targetName;
          } else {
            transitionName = transition;
          }
          set(sessionData, TRANSITION_AFTER_LOGIN, transitionName);
          sessionStore.persist(sessionData).then(() =>{
            this.displayAlert(title, message, 'unauthorizeSession');
          });
        } else {
          this.displayAlert(title, message, 'unauthorizeSession');
        }
      } else {
        this._super(reason);
      }
    },

    /**
     * Render a modal using the specifed path and optionally set a model.
     * @param modalPath the path to use for the controller and template.
     * @param model (optional) the model to set on the controller for the modal.
     */
    openModal(modalPath, model) {
      if (model) {
        set(this.controllerFor(modalPath), 'model', model);
      }
      this.renderModal(modalPath);
    },

    unauthorizeSession() {
      let session = get(this, 'session');
      if (get(session, 'isAuthenticated')) {
        session.invalidate();
      }
    },

    /**
     * Update an open modal using the specifed model.
     * @param modalPath the path to use for the controller and template.
     * @param model (optional) the model to set on the controller for the modal.
     */
    updateModal(modalPath, model) {
      set(this.controllerFor(modalPath), 'model', model);
    }
  },

  model(params, transition) {
    let session = get(this, 'session');
    let isAuthenticated = session && get(session, 'isAuthenticated');
    return get(this, 'config').setup().then(function(configs) {
      if (transition.targetName !== 'finishgauth' && transition.targetName !== 'login') {
        set(this, 'shouldSetupUserRole', true);
        if (isAuthenticated) {
          return get(this, 'database').setup(configs)
            .catch(() => {
              // Error thrown indicates missing auth, so invalidate session.
              session.invalidate();
            });
        }
      } else if (transition.targetName === 'finishgauth') {
        set(this, 'shouldSetupUserRole', false);
      }
    }.bind(this));
  },

  afterModel() {
    set(this.controllerFor('navigation'), 'allowSearch', false);
    $('#apploading').remove();
  },

  renderModal(template) {
    this.render(template, {
      into: 'application',
      outlet: 'modal'
    });
  },

  sessionAuthenticated() {
    if (get(this, 'shouldSetupUserRole') === true) {
      this.setupUserRole();
    }
    let session = get(this, 'session');
    let sessionData = session.get('data');
    let transitionAfterLogin = get(sessionData, TRANSITION_AFTER_LOGIN);
    if (!isEmpty(transitionAfterLogin)) {
      let sessionStore = session.get('store');
      set(sessionData, 'transitionAfterLogin', null);
      sessionStore.persist(sessionData).then(() =>{
        this.transitionTo(transitionAfterLogin);
      });
    } else {
      this._super();
    }
  }
});
export default ApplicationRoute;
