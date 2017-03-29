import Ember from "ember";
import checkCurrentRoute from "ember-inspector/utils/check-current-route";

const { Controller, computed, inject: { controller } } = Ember;

export default Controller.extend({
  application: controller(),

  queryParams: ['hideRoutes'],

  currentRoute: null,
  hideRoutes: computed.alias('options.hideRoutes'),

  options: {
    hideRoutes: false
  },

  model: computed(() => []),

  filtered: computed('model.[]', 'options.hideRoutes', 'currentRoute', function() {
    return this.get('model').filter(routeItem => {
      let currentRoute = this.get('currentRoute');
      let hideRoutes = this.get('options.hideRoutes');

      if (hideRoutes && currentRoute) {
        return checkCurrentRoute(currentRoute, routeItem.value.name);
      } else {
        return true;
      }
    });
  }),

  actions: {
    inspectRoute(name) {
      this.get('port').send('objectInspector:inspectRoute', { name });
    },
    sendRouteHandlerToConsole(name) {
      this.get('port').send('objectInspector:sendRouteHandlerToConsole', { name });
    },
    inspectController(controller) {
      if (!controller.exists) {
        return;
      }
      this.get('port').send('objectInspector:inspectController', { name: controller.name });
    },
    sendControllerToConsole(name) {
      this.get('port').send('objectInspector:sendControllerToConsole', { name });
    }
  }
});
