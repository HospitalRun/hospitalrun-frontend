import BasicAdapter from "ember-debug/adapters/basic";
import Port from "ember-debug/port";
import ObjectInspector from "ember-debug/object-inspector";
import GeneralDebug from "ember-debug/general-debug";
import RenderDebug from "ember-debug/render-debug";
import ViewDebug from "ember-debug/view-debug";
import RouteDebug from "ember-debug/route-debug";
import DataDebug from "ember-debug/data-debug";
import PromiseDebug from "ember-debug/promise-debug";
import ContainerDebug from "ember-debug/container-debug";
import DeprecationDebug from "ember-debug/deprecation-debug";
import Session from "ember-debug/services/session";

const Ember = window.Ember;
const { Object: EmberObject, run, Application, Namespace } = Ember;

const EmberDebug = EmberObject.extend({

  application: null,
  started: false,

  // Using object shorthand syntax here is somehow having strange side effects.
  // eslint-disable-next-line object-shorthand
  Port: Port,
  Adapter: BasicAdapter,

  start($keepAdapter) {
    if (this.get('started')) {
      this.reset($keepAdapter);
      return;
    }
    this.set('started', true);

    if (!this.get('application')) {
      this.set('application', getApplication());
    }

    this.reset();

    this.get("adapter").debug("Ember Inspector Active");
  },

  destroyContainer() {
    if (this.get('generalDebug')) {
      this.get('generalDebug').sendReset();
    }
    ['dataDebug',
    'viewDebug',
    'routeDebug',
    'generalDebug',
    'renderDebug',
    'promiseDebug',
    'containerDebug',
    'deprecationDebug',
    'objectInspector',
    'session'
    ].forEach(prop => {
      let handler = this.get(prop);
      if (handler) {
        run(handler, 'destroy');
        this.set(prop, null);
      }
    });
  },

  startModule(prop, Module) {
    this.set(prop, Module.create({ namespace: this }));
  },

  willDestroy() {
    this.destroyContainer();
    this._super(...arguments);
  },

  reset($keepAdapter) {
    this.destroyContainer();
    run(() => {
      // Adapters don't have state depending on the application itself.
      // They also maintain connections with the inspector which we will
      // lose if we destroy.
      if (!this.get('adapter') || !$keepAdapter) {
        this.startModule('adapter', this.Adapter);
      }
      if (!this.get('port') || !$keepAdapter) {
        this.startModule('port', this.Port);
      }

      this.startModule('session', Session);
      this.startModule('generalDebug', GeneralDebug);
      this.startModule('renderDebug', RenderDebug);
      this.startModule('objectInspector', ObjectInspector);
      this.startModule('routeDebug', RouteDebug);
      this.startModule('viewDebug', ViewDebug);
      this.startModule('dataDebug', DataDebug);
      this.startModule('promiseDebug', PromiseDebug);
      this.startModule('containerDebug', ContainerDebug);
      this.startModule('deprecationDebug', DeprecationDebug);

      this.generalDebug.sendBooted();
      this.viewDebug.sendTree();
    });
  },

  inspect(obj) {
    this.get('objectInspector').sendObject(obj);
    this.get('adapter').log('Sent to the Object Inspector');
    return obj;
  }

}).create();

function getApplication() {
  let namespaces = Namespace.NAMESPACES;
  let application;

  namespaces.forEach(namespace => {
    if (namespace instanceof Application) {
      application = namespace;
      return false;
    }
  });
  return application;
}

export default EmberDebug;
