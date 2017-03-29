import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('app-detected', { path: '/', resetNamespace: true }, function() {
    this.route('view-tree', { path: '/', resetNamespace: true });
    this.route('route-tree', { resetNamespace: true });

    this.route('data', { resetNamespace: true }, function() {
      this.route('model-types', { resetNamespace: true }, function() {
        this.route('model-type', { path: '/:type_id', resetNamespace: true }, function() {
          this.route('records', { resetNamespace: true });
        });
      });
    });

    this.route('promise-tree', { resetNamespace: true });

    this.route('info', { resetNamespace: true });
    this.route('render-tree', { resetNamespace: true });
    this.route('container-types', { resetNamespace: true }, function() {
      this.route('container-type', { path: '/:type_id', resetNamespace: true });
    });

    this.route('deprecations', { resetNamespace: true });
  });

});

export default Router;
