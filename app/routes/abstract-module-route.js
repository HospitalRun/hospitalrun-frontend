import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import UserSession from 'hospitalrun/mixins/user-session';

const { computed } = Ember;
/**
 * Abstract route for top level modules (eg patients, inventory, users)
 */
export default Ember.Route.extend(UserSession, AuthenticatedRouteMixin, {
  addCapability: null,
  additionalModels: null,
  allowSearch: true,
  currentScreenTitle: null,
  moduleName: null,
  newButtonText: null,
  sectionTitle: null,
  subActions: null,

  editPath: computed('moduleName', function() {
    return `${this.get('moduleName')}.edit`;
  }),

  deletePath: computed('moduleName', function() {
    return `${this.get('moduleName')}.delete`;
  }),

  searchRoute: computed('moduleName', function() {
    return `/${this.get('moduleName')}/search`;
  }),

  newButtonAction: computed(function() {
    if (this.currentUserCan(this.get('addCapability'))) {
      return 'newItem';
    } else {
      return null;
    }
  }),

  actions: {
    allItems() {
      this.transitionTo(this.get('moduleName') + '.index');
    },
    deleteItem(item) {
      var deletePath = this.get('deletePath');
      this.send('openModal', deletePath, item);
    },
    editItem(item) {
      this.transitionTo(this.get('editPath'), item);
    },
    newItem() {
      if (this.currentUserCan(this.get('addCapability'))) {
        this.transitionTo(this.get('editPath'), 'new');
      }
    },

    /**
     * Action to set items in the section header.
     * @param details an object containing details to set on the section header.
     * The following parameters are supported:
     * - currentScreenTitle - The current screen title.
     * - newButtonText - The text to display for the "new" button.
     * - newButtonAction - The action to fire for the "new" button.
     */
    setSectionHeader(details) {
      var currentController = this.controllerFor(this.get('moduleName'));
      currentController.setProperties(details);
    }

  },

  /**
   * Make sure the user has permissions to the module; if not reroute to index.
   */
  beforeModel(transition) {
    var moduleName = this.get('moduleName');
    if (this.currentUserCan(moduleName)) {
      return this._super(transition);
    } else {
      this.transitionTo('index');
      return Ember.RSVP.reject('Not available');
    }
  },

  /**
   * Override this function to generate an id for a new record
   * @return a promise that will resolved to a generated id;default is null which means that an
   * id will be automatically generated via Ember data.8
   */
  generateId() {
    return Ember.RSVP.resolve(null);
  },

  model() {
    if (!Ember.isEmpty(this.additionalModels)) {
      return new Ember.RSVP.Promise((resolve, reject) => {
        var promises = this.additionalModels.map((modelMap) => {
          if (modelMap.findArgs.length === 1) {
            return this.store.findAll.apply(this.store, modelMap.findArgs);
          } else {
            return this.store.find.apply(this.store, modelMap.findArgs);
          }
        });
        Ember.RSVP.allSettled(promises, `All additional Models for ${this.get('moduleName')}`).then((array) => {
          array.forEach((item, index) => {
            if (item.state === 'fulfilled') {
              this.set(this.additionalModels[index].name, item.value);
            }
          });
          resolve();
        }, reject);
      }, `Additional Models for ${this.get('moduleName')}`);
    } else {
      return Ember.RSVP.resolve();
    }
  },

  renderTemplate: function() {
    this.render('section');
  },

  setupController: function(controller, model) {
    var navigationController = this.controllerFor('navigation');
    if (this.get('allowSearch') === true) {
      navigationController.set('allowSearch', true);
      navigationController.set('searchRoute', this.get('searchRoute'));
    } else {
      navigationController.set('allowSearch', false);
    }
    var currentController = this.controllerFor(this.get('moduleName'));
    var propsToSet = this.getProperties('additionalButtons', 'currentScreenTitle', 'newButtonAction', 'newButtonText', 'sectionTitle', 'subActions');
    currentController.setProperties(propsToSet);
    if (!Ember.isEmpty(this.additionalModels)) {
      this.additionalModels.forEach((item) => {
        controller.set(item.name, this.get(item.name));
      });
    }
    this._super(controller, model);
  }

});
