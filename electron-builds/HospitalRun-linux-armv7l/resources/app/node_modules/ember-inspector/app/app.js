import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import Port from "./port";
import PromiseAssembler from "ember-inspector/libs/promise-assembler";

Ember.MODEL_FACTORY_INJECTIONS = true;

const version = '{{EMBER_INSPECTOR_VERSION}}';

const App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

// TODO: remove this when fixed
// problem description: registry classes being registered
// again on app reset. this will clear the registry.
// long term solution: make registry initializers run once on app
// creation.
// issue: https://github.com/emberjs/ember.js/issues/10310
// pr: https://github.com/emberjs/ember.js/pull/10597
App.reopen({
  buildInstance() {
    this.buildRegistry();
    return this._super(...arguments);
  }
});

config.VERSION = version;

// Inject adapter
App.initializer({
  name: "extension-init",

  initialize(instance) {
    // {{EMBER_DIST}} is replaced by the build process.
    instance.adapter = '{{EMBER_DIST}}';

    // register and inject adapter
    let Adapter;
    if (Ember.typeOf(instance.adapter) === 'string') {
      Adapter = instance.resolveRegistration(`adapter:${instance.adapter}`);
    } else {
      Adapter = instance.adapter;
    }
    instance.register('adapter:main', Adapter);
    instance.inject('port', 'adapter', 'adapter:main');
    instance.inject('route:application', 'adapter', 'adapter:main');
    instance.inject('route:deprecations', 'adapter', 'adapter:main');
    instance.inject('controller:deprecations', 'adapter', 'adapter:main');

    // register config
    instance.register('config:main', config, { instantiate: false });
    instance.inject('route', 'config', 'config:main');

    // inject port
    instance.register('port:main', instance.Port || Port);
    instance.inject('controller', 'port', 'port:main');
    instance.inject('route', 'port', 'port:main');
    instance.inject('component', 'port', 'port:main');
    instance.inject('promise-assembler', 'port', 'port:main');

    // register and inject promise assembler
    instance.register('promise-assembler:main', PromiseAssembler);
    instance.inject('route:promiseTree', 'assembler', 'promise-assembler:main');
  }
});


loadInitializers(App, config.modulePrefix);


export default App;
