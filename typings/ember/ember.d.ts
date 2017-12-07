interface DOMElement {}
interface Promise<T> {}
declare class Registry {}
declare class Transition {}
declare namespace Handlebars { class SafeString {} }
declare class JQuery {}


declare module 'ember' {
  export namespace Ember {
    /**
     * Framework objects in an Ember application (components, services, routes, etc.) are created via a factory and dependency injection system. Each of these objects is the responsibility of an "owner", which handled its instantiation and manages its lifetime.
     */
    function getOwner(object: {}): {};
    /**
     * `setOwner` forces a new owner on a given object instance. This is primarily useful in some testing cases.
     */
    function setOwner(object: {}): {};
    /**
     * Display a deprecation warning with the provided message and a stack trace (Chrome and Firefox only). Ember build tools will remove any calls to `Ember.deprecate()` when doing a production build.
     */
    function deprecate(message: string, test: boolean, options: {});
    /**
     * Define an assertion that will throw an exception if the condition is not met. Ember build tools will remove any calls to `Ember.assert()` when doing an Ember.js framework production build and will make the assertion a no-op for an application production build. Example:
     */
    function assert(desc: string, test: boolean);
    /**
     * Display a debug notice. Ember build tools will remove any calls to `Ember.debug()` when doing a production build.
     */
    function debug(message: string);
    /**
     * Run a function meant for debugging. Ember build tools will remove any calls to `Ember.runInDebug()` when doing a production build.
     */
    function runInDebug(func: Function);
    /**
     * Display a warning with the provided message. Ember build tools will remove any calls to `Ember.warn()` when doing a production build.
     */
    function warn(message: string, test: boolean, options: {});
    /**
     * Copy properties from a source object to a target object.
     */
    function assign(original: {}, args: {}): {};
    /**
     * Debug parameter you can turn on. This will log all bindings that fire to the console. This should be disabled in production code. Note that you can also enable this from the console or temporarily.
     */
    var LOG_BINDINGS: boolean;
    /**
     * Global helper method to create a new binding. Just pass the root object along with a `to` and `from` path to create and connect the binding.
     */
    function bind(obj: {}, to: string, from: string): Binding;
    /**
     * Returns the cached value for a property, if one exists. This can be useful for peeking at the value of a computed property that is generated lazily, without accidentally causing it to be created.
     */
    function cacheFor(obj: {}, key: string): {};
    /**
     * The semantic version.
     */
    var VERSION: string;
    /**
     * The hash of environment variables used to control various configuration settings. To specify your own or override default settings, add the desired properties to a global hash named `EmberENV` (or `ENV` for backwards compatibility with earlier versions of Ember). The `EmberENV` hash must be created before loading Ember.
     */
    var ENV: {};
    /**
     * Determines whether Ember should add to `Array`, `Function`, and `String` native object prototypes, a few extra methods in order to provide a more friendly API.
     */
    var EXTEND_PROTOTYPES: boolean;
    /**
     * The `LOG_STACKTRACE_ON_DEPRECATION` property, when true, tells Ember to log a full stack trace during deprecation warnings.
     */
    var LOG_STACKTRACE_ON_DEPRECATION: boolean;
    /**
     * The `LOG_VERSION` property, when true, tells Ember to log versions of all dependent libraries in use.
     */
    var LOG_VERSION: boolean;
    /**
     * An empty function useful for some operations. Always returns `this`.
     */
    function K(): {};
    /**
     * Add an event listener
     */
    function addListener(obj: any, eventName: string, target: {}|Function, method: Function|string, once: boolean);
    /**
     * Remove an event listener
     */
    function removeListener(obj: any, eventName: string, target: {}|Function, method: Function|string);
    /**
     * Send an event. The execution of suspended listeners is skipped, and once listeners are removed. A listener without a target is executed on the passed object. If an array of actions is not passed, the actions stored on the passed object are invoked.
     */
    function sendEvent(obj: any, eventName: string, params: Ember.Array, actions: Ember.Array): void;
    /**
     * Define a property as a function that should be executed when a specified event or events are triggered.
     */
    function on(eventNames: string, func: Function): void;
    /**
     * To get multiple properties at once, call `Ember.getProperties` with an object followed by a list of strings or an array:
     */
    function getProperties(obj: {}, ...list: string[]): {};
    /**
     * A value is blank if it is empty or a whitespace string.
     */
    function isBlank(obj: {}): boolean;
    /**
     * Verifies that a value is `null` or an empty string, empty array, or empty function.
     */
    function isEmpty(obj: {}): boolean;
    /**
     * Returns true if the passed value is null or undefined. This avoids errors from JSLint complaining about use of ==, which can be technically confusing.
     */
    function isNone(obj: {}): boolean;
    /**
     * A value is present if it not `isBlank`.
     */
    function isPresent(obj: {}): boolean;
    /**
     * Merge the contents of two objects together into the first object.
     */
    function merge(original: {}, updates: {}): {};
    /**
     * Makes a method available via an additional name.
     */
    function aliasMethod(methodName: string);
    /**
     * Specify a method that observes property changes.
     */
    function observer(propertyNames: string, func: Function): void;
    function addObserver(obj: any, _path: string, target: {}|Function, method: Function|string);
    function removeObserver(obj: any, path: string, target: {}|Function, method: Function|string);
    /**
     * Gets the value of a property on an object. If the property is computed, the function will be invoked. If the property is not defined but the object implements the `unknownProperty` method then that will be invoked.
     */
    function get(obj: {}, keyName: string): {};
    /**
     * Retrieves the value of a property from an Object, or a default value in the case that the property returns `undefined`.
     */
    function getWithDefault(obj: {}, keyName: string, defaultValue: {}): {};
    /**
     * Sets the value of a property on an object, respecting computed properties and notifying observers and other listeners of the change. If the property is not defined but the object implements the `setUnknownProperty` method then that will be invoked as well.
     */
    function set(obj: {}, keyName: string, value: {}): {};
    /**
     * Error-tolerant form of `Ember.set`. Will not blow up if any part of the chain is `undefined`, `null`, or destroyed.
     */
    function trySet(root: {}, path: string, value: {});
    /**
     * Set a list of properties on an object. These properties are set inside a single `beginPropertyChanges` and `endPropertyChanges` batch, so observers will be buffered.
     */
    function setProperties(obj: any, properties: {}): void;
    /**
     * Returns a unique id for the object. If the object does not yet have a guid, one will be assigned to it. You can call this on any object, `Ember.Object`-based or not, but be aware that it will add a `_guid` property.
     */
    function guidFor(obj: {}): string;
    /**
     * Checks to see if the `methodName` exists on the `obj`, and if it does, invokes it with the arguments passed.
     */
    function tryInvoke(obj: {}, methodName: string, args: Ember.Array): any;
    /**
     * Creates an `Ember.NativeArray` from an Array like object. Does not modify the original object. Ember.A is not needed if `Ember.EXTEND_PROTOTYPES` is `true` (the default value). However, it is recommended that you use Ember.A when creating addons for ember or when you can not guarantee that `Ember.EXTEND_PROTOTYPES` will be `true`.
     */
    function A(): NativeArray;
    /**
     * Compares two javascript values and returns:
     */
    function compare(v: {}, w: {}): number;
    /**
     * Creates a shallow copy of the passed object. A deep copy of the object is returned if the optional `deep` argument is `true`.
     */
    function copy(obj: {}, deep: boolean): {};
    /**
     * Compares two objects, returning true if they are equal.
     */
    function isEqual(a: {}, b: {}): boolean;
    /**
     * Returns true if the passed object is an array or Array-like.
     */
    function isArray(obj: {}): boolean;
    /**
     * Returns a consistent type for the passed object.
     */
    function typeOf(item: {}): string;
    /**
     * Alias for jQuery
     */
    function $();
    export namespace ApplicationInstance {
      /**
       * A list of boot-time configuration options for customizing the behavior of an `Ember.ApplicationInstance`.
       */
      export class BootOptions {
        /**
         * Run in a full browser environment.
         */
        isBrowser: boolean;
        /**
         * Disable rendering completely.
         */
        shouldRender: boolean;
        /**
         * If present, render into the given `Document` object instead of the global `window.document` object.
         */
        document: Document;
        /**
         * If present, overrides the application's `rootElement` property on the instance. This is useful for testing environment, where you might want to append the root view to a fixture area.
         */
        rootElement: string|Element;
        /**
         * If present, overrides the router's `location` property with this value. This is useful for environments where trying to modify the URL would be inappropriate.
         */
        location: string;
      }
    }
    export namespace Templates {
      export class helpers {
        /**
         * Concatenates input params together.
         */
        concat();
        /**
         * The `{{each-in}}` helper loops over properties on an object. It is unbound, in that new (or removed) properties added to the target object will not be rendered.
         */
        'each-in'();
        /**
         * The `{{#each}}` helper loops over elements in a collection. It is an extension of the base Handlebars `{{#each}}` helper.
         */
        each();
        /**
         * Use the `{{hash}}` helper to create a hash to pass as an option to your components. This is specially useful for contextual components where you can just yield a hash:
         */
        hash(options: {}): {};
        /**
         * Use the `if` block helper to conditionally render a block depending on a property. If the property is "falsey", for example: `false`, `undefined`, `null`, `""`, `0`, `NaN` or an empty array, the block will not be rendered.
         */
        if();
        /**
         * The `unless` helper is the inverse of the `if` helper. Its block will be rendered if the expression contains a falsey value.  All forms of the `if` helper can also be used with `unless`.
         */
        unless();
        /**
         * Calls [Ember.String.loc](/api/classes/Ember.String.html#method_loc) with the provided string. This is a convenient way to localize text within a template. For example:
         */
        loc(str: string);
        /**
         * `log` allows you to output the value of variables in the current rendering context. `log` also accepts primitive types such as strings or numbers.
         */
        log(values: any);
        /**
         * Use the `{{with}}` helper when you want to alias a property to a new name. This is helpful for semantic clarity as it allows you to retain default scope or to reference a property from another `{{with}}` block.
         */
        with(options: {}): string;
        /**
         * DEPRECATED: Use `{{each}}` helper instead.
         * `{{collection}}` is a template helper for adding instances of `Ember.CollectionView` to a template. See [Ember.CollectionView](/api/classes/Ember.CollectionView.html) for additional information on how a `CollectionView` functions.
         */
        collection();
        /**
         * The `{{component}}` helper lets you add instances of `Ember.Component` to a template. See [Ember.Component](/api/classes/Ember.Component.html) for additional information on how a `Component` functions. `{{component}}`'s primary use is for cases where you want to dynamically change which type of component is rendered as the state of your application changes. The provided block will be applied as the template for the component. Given an empty `<body>` the following template:
         */
        component();
        /**
         * Execute the `debugger` statement in the current template's context.
         */
        debugger();
        /**
         * Dynamically look up a property on an object. The second argument to `{{get}}` should have a string value, although it can be bound.
         */
        get();
        /**
         * The `{{input}}` helper lets you create an HTML `<input />` component. It causes an `Ember.TextField` component to be rendered.  For more info, see the [Ember.TextField](/api/classes/Ember.TextField.html) docs and the [templates guide](http://emberjs.com/guides/templates/input-helpers/).
         */
        input(options: {});
        /**
         * The `mut` helper lets you __clearly specify__ that a child `Component` can update the (mutable) value passed to it, which will __change the value of the parent component__.
         */
        mut(attr: {});
        /**
         * The `{{outlet}}` helper lets you specify where a child routes will render in your template. An important use of the `{{outlet}}` helper is in your application's `application.hbs` file:
         */
        outlet(name: string);
        /**
         * The `partial` helper renders another template without changing the template context:
         */
        partial(partialName: string);
        /**
         * `{{textarea}}` inserts a new instance of `<textarea>` tag into the template. The attributes of `{{textarea}}` match those of the native HTML tags as closely as possible.
         */
        textarea(options: {});
        /**
         * The `{{unbound}}` helper disconnects the one-way binding of a property, essentially freezing its value at the moment of rendering. For example, in this example the display of the variable `name` will not change even if it is set with a new value:
         */
        unbound();
        /**
         * DEPRECATED: 
         * `{{view}}` inserts a new instance of an `Ember.View` into a template passing its options to the `Ember.View`'s `create` method and using the supplied block as the view's own template.
         */
        view();
        /**
         * This is a helper to be used in conjunction with the link-to helper. It will supply url query parameters to the target route.
         */
        'query-params'(hash: {}): {};
        /**
         * The `{{action}}` helper provides a way to pass triggers for behavior (usually just a function) between components, and into components from controllers.
         */
        action();
        /**
         * Calling ``{{render}}`` from within a template will insert another template that matches the provided name. The inserted template will access its properties on its own controller (rather than the controller of the parent template). If a view class with the same name exists, the view class also will be used. Note: A given controller may only be used *once* in your app in this manner. A singleton instance of the controller will be created for you. Example:
         */
        render(name: string, context: {}, options: {}): string;
        /**
         * The `{{link-to}}` component renders a link to the supplied `routeName` passing an optionally supplied model to the route as its `model` context of the route. The block for `{{link-to}}` becomes the innerHTML of the rendered element:
         */
        'link-to'(routeName: string, context: {}, options: {}): string;
      }
    }
    export namespace streams {
      export namespace Ember {
        export class stream {
        }
      }
      export class Dependency {
      }
      export class Subscriber {
      }
    }
    export namespace stream {
      export class Stream {
      }
    }
    export namespace Test {
      /**
       * Loads a route, sets up any controllers, and renders any templates associated with the route as though a real user had triggered the route change while using your app.
       */
      function visit(url: string): RSVP.Promise<any>;
      /**
       * Clicks an element and triggers any actions triggered by the element's `click` event.
       */
      function click(selector: string): RSVP.Promise<any>;
      /**
       * Simulates a key event, e.g. `keypress`, `keydown`, `keyup` with the desired keyCode
       */
      function keyEvent(selector: string, type: string, keyCode: number): RSVP.Promise<any>;
      /**
       * Fills in an input element with some text.
       */
      function fillIn(selector: string, text: string): RSVP.Promise<any>;
      /**
       * Finds an element in the context of the app's container element. A simple alias for `app.$(selector)`.
       */
      function find(selector: string): {};
      /**
       * Like `find`, but throws an error if the element selector returns no results.
       */
      function findWithAssert(selector: string): {};
      /**
       * Causes the run loop to process any pending events. This is used to ensure that any async operations from other helpers (or your assertions) have been processed.
       */
      function wait(value: {}): RSVP.Promise<any>;
      /**
       * Returns the currently active route name.
       */
      function currentRouteName(): {};
      /**
       * Returns the current path.
       */
      function currentPath(): {};
      /**
       * Returns the current URL.
       */
      function currentURL(): {};
      /**
       * Pauses the current test - this is useful for debugging while testing or for test-driving. It allows you to inspect the state of your application at any point.
       */
      function pauseTest(): {};
      /**
       * Triggers the given DOM event on the element identified by the provided selector.
       */
      function triggerEvent(selector: string, context: string, type: string, options: {}): RSVP.Promise<any>;
      /**
       * This hook defers the readiness of the application, so that you can start the app when your tests are ready to run. It also sets the router's location to 'none', so that the window's location will not be modified (preventing both accidental leaking of state between tests and interference with your testing framework).
       */
      function setupForTesting();
      /**
       * `registerHelper` is used to register a test helper that will be injected when `App.injectTestHelpers` is called.
       */
      function registerHelper(name: string, helperMethod: Function, options: {});
      /**
       * `registerAsyncHelper` is used to register an async test helper that will be injected when `App.injectTestHelpers` is called.
       */
      function registerAsyncHelper(name: string, helperMethod: Function);
      /**
       * Remove a previously added helper method.
       */
      function unregisterHelper(name: string);
      /**
       * Used to register callbacks to be fired whenever `App.injectTestHelpers` is called.
       */
      function onInjectHelpers(callback: Function);
      /**
       * This returns a thenable tailored for testing.  It catches failed `onSuccess` callbacks and invokes the `Ember.Test.adapter.exception` callback in the last chained then.
       */
      function promise(resolver: Function, label: string);
      /**
       * Used to allow ember-testing to communicate with a specific testing framework.
       */
      var adapter: any;
      /**
       * Replacement for `Ember.RSVP.resolve` The only difference is this uses an instance of `Ember.Test.Promise`
       */
      function resolve(The: any);
      /**
       * This allows ember-testing to play nicely with other asynchronous events, such as an application that is waiting for a CSS3 transition or an IndexDB transaction.
       */
      function registerWaiter(context: {}, callback: Function);
      /**
       * `unregisterWaiter` is used to unregister a callback that was registered with `registerWaiter`.
       */
      function unregisterWaiter(context: {}, callback: Function);
      /**
       * This property contains the testing helpers for the current application. These are created once you call `injectTestHelpers` on your `Ember.Application` instance. The included helpers are also available on the `window` object by default, but can be used from this object on the individual application also.
       */
      var testHelpers: {};
      /**
       * This property indicates whether or not this application is currently in testing mode. This is set when `setupForTesting` is called on the current application.
       */
      var testing: boolean;
      /**
       * This injects the test helpers into the `helperContainer` object. If an object is provided it will be used as the helperContainer. If `helperContainer` is not set it will default to `window`. If a function of the same name has already been defined it will be cached (so that it can be reset if the helper is removed with `unregisterHelper` or `removeTestHelpers`).
       */
      function injectTestHelpers();
      /**
       * This removes all helpers that have been registered, and resets and functions that were overridden by the helpers.
       */
      function removeTestHelpers();
      /**
       * The primary purpose of this class is to create hooks that can be implemented by an adapter for various test frameworks.
       */
      export class Adapter {
        /**
         * This callback will be called whenever an async operation is about to start.
         */
        asyncStart();
        /**
         * This callback will be called whenever an async operation has completed.
         */
        asyncEnd();
        /**
         * Override this method with your testing framework's false assertion. This function is called whenever an exception occurs causing the testing promise to fail.
         */
        exception(error: string);
      }
      /**
       * This class implements the methods defined by Ember.Test.Adapter for the QUnit testing framework.
       */
      export class QUnitAdapter extends Adapter {
      }
    }
    /**
     * The `ApplicationInstance` encapsulates all of the stateful aspects of a running `Application`.
     */
    export class ApplicationInstance extends EngineInstance {
    }
    /**
     * An instance of `Ember.Application` is the starting point for every Ember application. It helps to instantiate, initialize and coordinate the many objects that make up your app.
     */
    export class Application extends Engine implements RegistryProxyMixin {
      /**
       * The root DOM element of the Application. This can be specified as an element or a [jQuery-compatible selector string](http://api.jquery.com/category/selectors/).
       */
      rootElement: DOMElement;
      /**
       * The `Ember.EventDispatcher` responsible for delegating events to this application's views.
       */
      eventDispatcher: EventDispatcher;
      /**
       * The DOM events for which the event dispatcher should listen.
       */
      customEvents: {};
      /**
       * Use this to defer readiness until some condition is true.
       */
      deferReadiness();
      /**
       * Call `advanceReadiness` after any asynchronous setup logic has completed. Each call to `deferReadiness` must be matched by a call to `advanceReadiness` or the application will never become ready and routing will not begin.
       */
      advanceReadiness();
      /**
       * Reset the application. This is typically used only in tests. It cleans up the application in the following order:
       */
      reset();
      /**
       * Boot a new instance of `Ember.ApplicationInstance` for the current application and navigate it to the given `url`. Returns a `Promise` that resolves with the instance when the initial routing and rendering is complete, or rejects with any error that occured during the boot process.
       */
      visit(url: string, options: ApplicationInstance.BootOptions): Promise<Ember.ApplicationInstance|Error>;
      /**
       * This creates a registry with the default Ember naming conventions.
       */
      static buildRegistry(namespace: Application): Registry;
      /**
       * Given a fullName return the corresponding factory.
       */
      resolveRegistration(fullName: string): Function;
      /**
       * Registers a factory that can be used for dependency injection (with `inject`) or for service lookup. Each factory is registered with a full name including two parts: `type:name`.
       */
      register(fullName: string, factory: Function, options: {});
      /**
       * Unregister a factory.
       */
      unregister(fullName: string);
      /**
       * Check if a factory is registered.
       */
      hasRegistration(fullName: string): boolean;
      /**
       * Register an option for a particular factory.
       */
      registerOption(fullName: string, optionName: string, options: {});
      /**
       * Return a specific registered option for a particular factory.
       */
      registeredOption(fullName: string, optionName: string): {};
      /**
       * Register options for a particular factory.
       */
      registerOptions(fullName: string, options: {});
      /**
       * Return registered options for a particular factory.
       */
      registeredOptions(fullName: string): {};
      /**
       * Allow registering options for all factories of a type.
       */
      registerOptionsForType(type: string, options: {});
      /**
       * Return the registered options for all factories of a type.
       */
      registeredOptionsForType(type: string): {};
      /**
       * Define a dependency injection onto a specific factory or all factories of a type.
       */
      inject(factoryNameOrType: string, property: string, injectionName: string);
    }
    /**
     * The `EngineInstance` encapsulates all of the stateful aspects of a running `Engine`.
     */
    export class EngineInstance extends Object implements RegistryProxyMixin, ContainerProxyMixin {
      /**
       * Unregister a factory.
       */
      unregister(fullName: string);
      /**
       * Given a fullName return the corresponding factory.
       */
      resolveRegistration(fullName: string): Function;
      /**
       * Registers a factory that can be used for dependency injection (with `inject`) or for service lookup. Each factory is registered with a full name including two parts: `type:name`.
       */
      register(fullName: string, factory: Function, options: {});
      /**
       * Check if a factory is registered.
       */
      hasRegistration(fullName: string): boolean;
      /**
       * Register an option for a particular factory.
       */
      registerOption(fullName: string, optionName: string, options: {});
      /**
       * Return a specific registered option for a particular factory.
       */
      registeredOption(fullName: string, optionName: string): {};
      /**
       * Register options for a particular factory.
       */
      registerOptions(fullName: string, options: {});
      /**
       * Return registered options for a particular factory.
       */
      registeredOptions(fullName: string): {};
      /**
       * Allow registering options for all factories of a type.
       */
      registerOptionsForType(type: string, options: {});
      /**
       * Return the registered options for all factories of a type.
       */
      registeredOptionsForType(type: string): {};
      /**
       * Define a dependency injection onto a specific factory or all factories of a type.
       */
      inject(factoryNameOrType: string, property: string, injectionName: string);
      /**
       * Returns an object that can be used to provide an owner to a manually created instance.
       */
      ownerInjection(): {};
      /**
       * Given a fullName return a corresponding instance.
       */
      lookup(fullName: string, options: {}): any;
    }
    /**
     * The `Engine` class contains core functionality for both applications and engines.
     */
    export class Engine extends Namespace {
      /**
       * This creates a registry with the default Ember naming conventions.
       */
      static buildRegistry(namespace: Application): Registry;
      /**
       * The goal of initializers should be to register dependencies and injections. This phase runs once. Because these initializers may load code, they are allowed to defer application readiness and advance it. If you need to access the container or store you should use an InstanceInitializer that will be run after all initializers and therefore after all code is loaded and the app is ready.
       */
      initializer(initializer: {});
      /**
       * Instance initializers run after all initializers have run. Because instance initializers run after the app is fully set up. We have access to the store, container, and other items. However, these initializers run after code has loaded and are not allowed to defer readiness.
       */
      instanceInitializer(instanceInitializer: any);
      /**
       * Set this to provide an alternate class to `Ember.DefaultResolver`
       */
      resolver: any;
    }
    /**
     * The DefaultResolver defines the default lookup rules to resolve container lookups before consulting the container for registered items:
     */
    export class DefaultResolver extends Object {
      /**
       * This will be set to the Application instance when it is created.
       */
      namespace: any;
      /**
       * This method is called via the container's resolver method. It parses the provided `fullName` and then looks up and returns the appropriate template or class.
       */
      resolve(fullName: string): {};
      /**
       * Convert the string name of the form 'type:name' to a Javascript object with the parsed aspects of the name broken out.
       */
      parseName(fullName: string);
      /**
       * Returns a human-readable description for a fullName. Used by the Application namespace in assertions to describe the precise name of the class that Ember is looking for, rather than container keys.
       */
      lookupDescription(fullName: string);
      /**
       * Given a parseName object (output from `parseName`), apply the conventions expected by `Ember.Router`
       */
      useRouterNaming(parsedName: {});
      /**
       * Look up the template in Ember.TEMPLATES
       */
      resolveTemplate(parsedName: {});
      /**
       * Lookup the view using `resolveOther`
       */
      resolveView(parsedName: {});
      /**
       * Lookup the controller using `resolveOther`
       */
      resolveController(parsedName: {});
      /**
       * Lookup the route using `resolveOther`
       */
      resolveRoute(parsedName: {});
      /**
       * Lookup the model on the Application namespace
       */
      resolveModel(parsedName: {});
      /**
       * Look up the specified object (from parsedName) on the appropriate namespace (usually on the Application)
       */
      resolveHelper(parsedName: {});
      /**
       * Look up the specified object (from parsedName) on the appropriate namespace (usually on the Application)
       */
      resolveOther(parsedName: {});
    }
    export class Debug {
      /**
       * Allows for runtime registration of handler functions that override the default deprecation behavior. Deprecations are invoked by calls to [Ember.deprecate](http://emberjs.com/api/classes/Ember.html#method_deprecate). The following example demonstrates its usage by registering a handler that throws an error if the message contains the word "should", otherwise defers to the default handler.
       */
      static registerDeprecationHandler(handler: Function);
      /**
       * Allows for runtime registration of handler functions that override the default warning behavior. Warnings are invoked by calls made to [Ember.warn](http://emberjs.com/api/classes/Ember.html#method_warn). The following example demonstrates its usage by registering a handler that does nothing overriding Ember's default warning behavior.
       */
      static registerWarnHandler(handler: Function);
    }
    /**
     * The `ContainerDebugAdapter` helps the container and resolver interface with tools that debug Ember such as the [Ember Extension](https://github.com/tildeio/ember-extension) for Chrome and Firefox.
     */
    export class ContainerDebugAdapter extends Object {
      /**
       * The resolver instance of the application being debugged. This property will be injected on creation.
       */
      resolver: any;
      /**
       * Returns true if it is possible to catalog a list of available classes in the resolver for a given type.
       */
      canCatalogEntriesByType(type: string): boolean;
      /**
       * Returns the available classes a given type.
       */
      catalogEntriesByType(type: string): Ember.Array;
    }
    /**
     * The `DataAdapter` helps a data persistence library interface with tools that debug Ember such as the [Ember Extension](https://github.com/tildeio/ember-extension) for Chrome and Firefox.
     */
    export class DataAdapter {
      /**
       * The container-debug-adapter which is used to list all models.
       */
      containerDebugAdapter: any;
      /**
       * Ember Data > v1.0.0-beta.18 requires string model names to be passed around instead of the actual factories.
       */
      acceptsModelName: any;
      /**
       * Specifies how records can be filtered. Records returned will need to have a `filterValues` property with a key for every name in the returned array.
       */
      getFilters(): Ember.Array;
      /**
       * Fetch the model types and observe them for changes.
       */
      watchModelTypes(typesAdded: Function, typesUpdated: Function): Function;
      /**
       * Fetch the records of a given type and observe them for changes.
       */
      watchRecords(modelName: string, recordsAdded: Function, recordsUpdated: Function, recordsRemoved: Function): Function;
    }
    export class HTMLBars {
    }
    /**
     * Defines string helper methods including string formatting and localization. Unless `Ember.EXTEND_PROTOTYPES.String` is `false` these methods will also be added to the `String.prototype` as well.
     */
    export class String {
      /**
       * Mark a string as safe for unescaped output with Ember templates. If you return HTML from a helper, use this function to ensure Ember's rendering layer does not escape the HTML.
       */
      static htmlSafe(): Handlebars.SafeString;
      /**
       * DEPRECATED: Use ES6 template strings instead: http://babeljs.io/docs/learn-es2015/#template-strings
       * Apply formatting options to the string. This will look for occurrences of "%@" in your string and substitute them with the arguments you pass into this method. If you want to control the specific order of replacement, you can add a number after the key as well to indicate which argument you want to insert.
       */
      fmt(str: string, formats: Ember.Array): string;
      /**
       * Formats the passed string, but first looks up the string in the localized strings hash. This is a convenient way to localize text. See `Ember.String.fmt()` for more information on formatting.
       */
      loc(str: string, formats: Ember.Array): string;
      /**
       * Splits a string into separate units separated by spaces, eliminating any empty strings in the process. This is a convenience method for split that is mostly useful when applied to the `String.prototype`.
       */
      w(str: string): Ember.Array;
      /**
       * Converts a camelized string into all lower case separated by underscores.
       */
      decamelize(str: string): string;
      /**
       * Replaces underscores, spaces, or camelCase with dashes.
       */
      dasherize(str: string): string;
      /**
       * Returns the lowerCamelCase form of a string.
       */
      camelize(str: string): string;
      /**
       * Returns the UpperCamelCase form of a string.
       */
      classify(str: string): string;
      /**
       * More general than decamelize. Returns the lower\_case\_and\_underscored form of a string.
       */
      underscore(str: string): string;
      /**
       * Returns the Capitalized form of a string
       */
      capitalize(str: string): string;
    }
    /**
     * Ember Helpers are functions that can compute values, and are used in templates. For example, this code calls a helper named `format-currency`:
     */
    export class Helper {
      /**
       * On a class-based helper, it may be useful to force a recomputation of that helpers value. This is akin to `rerender` on a component.
       */
      recompute();
      /**
       * Override this function when writing a class-based helper.
       */
      compute(params: Ember.Array, hash: {});
      /**
       * In many cases, the ceremony of a full `Ember.Helper` class is not required. The `helper` method create pure-function helpers without instances. For example:
       */
      static helper(helper: Function);
    }
    /**
     * An `Ember.Binding` connects the properties of two objects so that whenever the value of one property changes, the other property will be changed also.
     */
    export class Binding {
      /**
       * This copies the Binding so it can be connected to another object.
       */
      copy(): Binding;
      /**
       * This will set `from` property path to the specified value. It will not attempt to resolve this property path to an actual object until you connect the binding.
       */
      from(path: string): Binding;
      /**
       * This will set the `to` property path to the specified value. It will not attempt to resolve this property path to an actual object until you connect the binding.
       */
      to(path: string|any[]): Binding;
      /**
       * Configures the binding as one way. A one-way binding will relay changes on the `from` side to the `to` side, but not the other way around. This means that if you change the `to` side directly, the `from` side may have a different value.
       */
      oneWay(): Binding;
      toString(): string;
      /**
       * Attempts to connect this binding instance so that it can receive and relay changes. This method will raise an exception if you have not set the from/to properties yet.
       */
      connect(obj: {}): Binding;
      /**
       * Disconnects the binding instance. Changes will no longer be relayed. You will not usually need to call this method.
       */
      disconnect(obj: {}): Binding;
    }
    /**
     * A computed property transforms an object literal with object's accessor function(s) into a property.
     */
    export class ComputedProperty {
      /**
       * Call on a computed property to set it into non-cached mode. When in this mode the computed property will not automatically cache the return value.
       */
      volatile(): ComputedProperty;
      /**
       * Call on a computed property to set it into read-only mode. When in this mode the computed property will throw an error when set.
       */
      readOnly(): ComputedProperty;
      /**
       * Sets the dependent keys on this computed property. Pass any number of arguments containing key paths that this computed property depends on.
       */
      property(path: string): ComputedProperty;
      /**
       * In some cases, you may want to annotate computed properties with additional metadata about how they function or what values they operate on. For example, computed property functions may close over variables that are then no longer available for introspection.
       */
      meta(meta: {});
      /**
       * Access the value of the function backing the computed property. If this property has already been cached, return the cached result. Otherwise, call the function passing the property name as an argument.
       */
      get(keyName: string): {};
      /**
       * Set the value of a computed property. If the function that backs your computed property does not accept arguments then the default action for setting would be to define the property on the current object, and set the value of the property to the value being set.
       */
      set(keyName: string, newValue: {}): {};
    }
    /**
     * This helper returns a new property descriptor that wraps the passed computed property function. You can use this helper to define properties with mixins or via `Ember.defineProperty()`.
     */
    export class computed {
      /**
       * A computed property that returns true if the value of the dependent property is null, an empty string, empty array, or empty function.
       */
      empty(dependentKey: string): ComputedProperty;
      /**
       * A computed property that returns true if the value of the dependent property is NOT null, an empty string, empty array, or empty function.
       */
      notEmpty(dependentKey: string): ComputedProperty;
      /**
       * A computed property that returns true if the value of the dependent property is null or undefined. This avoids errors from JSLint complaining about use of ==, which can be technically confusing.
       */
      none(dependentKey: string): ComputedProperty;
      /**
       * A computed property that returns the inverse boolean value of the original value for the dependent property.
       */
      not(dependentKey: string): ComputedProperty;
      /**
       * A computed property that converts the provided dependent property into a boolean value.
       */
      bool(dependentKey: string): ComputedProperty;
      /**
       * A computed property which matches the original value for the dependent property against a given RegExp, returning `true` if the value matches the RegExp and `false` if it does not.
       */
      match(dependentKey: string, regexp: RegExp): ComputedProperty;
      /**
       * A computed property that returns true if the provided dependent property is equal to the given value.
       */
      equal(dependentKey: string, value: string|number|{}): ComputedProperty;
      /**
       * A computed property that returns true if the provided dependent property is greater than the provided value.
       */
      gt(dependentKey: string, value: number): ComputedProperty;
      /**
       * A computed property that returns true if the provided dependent property is greater than or equal to the provided value.
       */
      gte(dependentKey: string, value: number): ComputedProperty;
      /**
       * A computed property that returns true if the provided dependent property is less than the provided value.
       */
      lt(dependentKey: string, value: number): ComputedProperty;
      /**
       * A computed property that returns true if the provided dependent property is less than or equal to the provided value.
       */
      lte(dependentKey: string, value: number): ComputedProperty;
      /**
       * A computed property that performs a logical `and` on the original values for the provided dependent properties.
       */
      and(dependentKey: string): ComputedProperty;
      /**
       * A computed property which performs a logical `or` on the original values for the provided dependent properties.
       */
      or(dependentKey: string): ComputedProperty;
      /**
       * Creates a new property that is an alias for another property on an object. Calls to `get` or `set` this property behave as though they were called on the original property.
       */
      alias(dependentKey: string): ComputedProperty;
      /**
       * Where `computed.alias` aliases `get` and `set`, and allows for bidirectional data flow, `computed.oneWay` only provides an aliased `get`. The `set` will not mutate the upstream property, rather causes the current property to become the value set. This causes the downstream property to permanently diverge from the upstream property.
       */
      oneWay(dependentKey: string): ComputedProperty;
      /**
       * This is a more semantically meaningful alias of `computed.oneWay`, whose name is somewhat ambiguous as to which direction the data flows.
       */
      reads(dependentKey: string): ComputedProperty;
      /**
       * Where `computed.oneWay` provides oneWay bindings, `computed.readOnly` provides a readOnly one way binding. Very often when using `computed.oneWay` one does not also want changes to propagate back up, as they will replace the value.
       */
      readOnly(dependentKey: string): ComputedProperty;
      /**
       * Creates a new property that is an alias for another property on an object. Calls to `get` or `set` this property behave as though they were called on the original property, but also print a deprecation warning.
       */
      deprecatingAlias(dependentKey: string): ComputedProperty;
      /**
       * A computed property that returns the sum of the values in the dependent array.
       */
      sum(dependentKey: string): ComputedProperty;
      /**
       * A computed property that calculates the maximum value in the dependent array. This will return `-Infinity` when the dependent array is empty.
       */
      max(dependentKey: string): ComputedProperty;
      /**
       * A computed property that calculates the minimum value in the dependent array. This will return `Infinity` when the dependent array is empty.
       */
      min(dependentKey: string): ComputedProperty;
      /**
       * Returns an array mapped via the callback
       */
      map(dependentKey: string, callback: Function): ComputedProperty;
      /**
       * Returns an array mapped to the specified key.
       */
      mapBy(dependentKey: string, propertyKey: string): ComputedProperty;
      /**
       * Filters the array by the callback.
       */
      filter(dependentKey: string, callback: Function): ComputedProperty;
      /**
       * Filters the array by the property and value
       */
      filterBy(dependentKey: string, propertyKey: string, value: any): ComputedProperty;
      /**
       * A computed property which returns a new array with all the unique elements from one or more dependent arrays.
       */
      uniq(propertyKey: string): ComputedProperty;
      /**
       * Alias for [Ember.computed.uniq](/api/#method_computed_uniq).
       */
      union(propertyKey: string): ComputedProperty;
      /**
       * A computed property which returns a new array with all the duplicated elements from two or more dependent arrays.
       */
      intersect(propertyKey: string): ComputedProperty;
      /**
       * A computed property which returns a new array with all the properties from the first dependent array that are not in the second dependent array.
       */
      setDiff(setAProperty: string, setBProperty: string): ComputedProperty;
      /**
       * A computed property that returns the array of values for the provided dependent properties.
       */
      collect(dependentKey: string): ComputedProperty;
      /**
       * A computed property which returns a new array with all the properties from the first dependent array sorted based on a property or sort function.
       */
      sort(itemsKey: string, sortDefinition: string): ComputedProperty;
    }
    /**
     * A subclass of the JavaScript Error object for use in Ember.
     */
    export class Error {
    }
    /**
     * The hash of enabled Canary features. Add to this, any canary features before creating your application.
     */
    export class FEATURES {
      /**
       * Determine whether the specified `feature` is enabled. Used by Ember's build tools to exclude experimental features from beta/stable builds.
       */
      isEnabled(feature: string): boolean;
    }
    /**
     * Read-only property that returns the result of a container lookup.
     */
    export class InjectedProperty {
    }
    /**
     * The purpose of the Ember Instrumentation module is to provide efficient, general-purpose instrumentation for Ember.
     */
    export class Instrumentation {
    }
    /**
     * Inside Ember-Metal, simply uses the methods from `imports.console`. Override this to provide more robust logging functionality.
     */
    export class Logger {
      /**
       * Logs the arguments to the console. You can pass as many arguments as you want and they will be joined together with a space.
       */
      log(args: any);
      /**
       * Prints the arguments to the console with a warning icon. You can pass as many arguments as you want and they will be joined together with a space.
       */
      warn(args: any);
      /**
       * Prints the arguments to the console with an error icon, red text and a stack trace. You can pass as many arguments as you want and they will be joined together with a space.
       */
      error(args: any);
      /**
       * Logs the arguments to the console. You can pass as many arguments as you want and they will be joined together with a space.
       */
      info(args: any);
      /**
       * Logs the arguments to the console in blue text. You can pass as many arguments as you want and they will be joined together with a space.
       */
      debug(args: any);
      /**
       * If the value passed into `Ember.Logger.assert` is not truthy it will throw an error with a stack trace.
       */
      assert(bool: boolean);
    }
    /**
     * This class is used internally by Ember and Ember Data. Please do not use it at this time. We plan to clean it up and add many tests soon.
     */
    export class OrderedSet {
    }
    /**
     * A Map stores values indexed by keys. Unlike JavaScript's default Objects, the keys of a Map can be any JavaScript object.
     */
    export class Map {
    }
    export class MapWithDefault extends Map {
    }
    /**
     * The `Ember.Mixin` class allows you to create mixins, whose properties can be added to other classes. For instance,
     */
    export class Mixin {
      static create(args: any);
    }
    /**
     * Runs the passed target and method inside of a RunLoop, ensuring any deferred actions including bindings and views updates are flushed at the end.
     */
    export class run {
      /**
       * DEPRECATED: 
       * Replaces objects in an array with the passed objects.
       */
      replace(array: Ember.Array, idx: number, amt: number, objects: Ember.Array): Ember.Array;
      /**
       * If no run-loop is present, it creates a new one. If a run loop is present it will queue itself to run on the existing run-loops action queue.
       */
      join(target: {}, method: Function|string, ...args: any[]): {};
      /**
       * Allows you to specify which context to call the specified function in while adding the execution of that function to the Ember run loop. This ability makes this method a great way to asynchronously integrate third-party libraries into your Ember application.
       */
      bind(target: {}, method: Function|string, ...args: any[]): Function;
      /**
       * Begins a new RunLoop. Any deferred actions invoked after the begin will be buffered until you invoke a matching call to `run.end()`. This is a lower-level way to use a RunLoop instead of using `run()`.
       */
      begin(): void;
      /**
       * Ends a RunLoop. This must be called sometime after you call `run.begin()` to flush any deferred actions. This is a lower-level way to use a RunLoop instead of using `run()`.
       */
      end(): void;
      /**
       * Adds the passed target/method and any optional arguments to the named queue to be executed at the end of the RunLoop. If you have not already started a RunLoop when calling this method one will be started for you automatically.
       */
      schedule(queue: string, target: {}, method: string|Function, ...args: any[]): void;
      /**
       * Invokes the passed target/method and optional arguments after a specified period of time. The last parameter of this method must always be a number of milliseconds.
       */
      later(target: {}, method: Function|string, ...args: any[]): any;
      later(target: {}, method: Function|string, wait: number): any;
      /**
       * Schedule a function to run one time during the current RunLoop. This is equivalent to calling `scheduleOnce` with the "actions" queue.
       */
      once(target: {}, method: Function|string, ...args: any[]): {};
      /**
       * Schedules a function to run one time in a given queue of the current RunLoop. Calling this method with the same queue/target/method combination will have no effect (past the initial call).
       */
      scheduleOnce(queue: string, target: {}, method: Function|string, ...args: any[]): {};
      /**
       * Schedules an item to run from within a separate run loop, after control has been returned to the system. This is equivalent to calling `run.later` with a wait time of 1ms.
       */
      next(target: {}, method: Function|string, ...args: any[]): {};
      /**
       * Cancels a scheduled item. Must be a value returned by `run.later()`, `run.once()`, `run.scheduleOnce()`, `run.next()`, `run.debounce()`, or `run.throttle()`.
       */
      cancel(timer: {}): boolean;
      /**
       * Delay calling the target method until the debounce period has elapsed with no additional debounce calls. If `debounce` is called again before the specified time has elapsed, the timer is reset and the entire period must pass again before the target method is called.
       */
      debounce(target: {}, method: Function|string, ...args: any[]): Ember.Array;
      debounce(target: {}, method: Function|string, wait: number, immediate: boolean): Ember.Array;
      /**
       * Ensure that the target method is never called more frequently than the specified spacing period. The target method is called immediately.
       */
      throttle(target: {}, method: Function|string, ...args: any[]): Ember.Array;
      throttle(target: {}, method: Function|string, spacing: number, immediate: boolean): Ember.Array;
    }
    export class ControllerMixin implements ActionHandler {
      /**
       * Defines which query parameters the controller accepts. If you give the names `['category','page']` it will bind the values of these query parameters to the variables `this.category` and `this.page`
       */
      queryParams: any;
      /**
       * Transition the application into another route. The route may be either a single route or route path:
       */
      transitionToRoute(name: string, ...models: any[]);
      transitionToRoute(name: string, options: {});
      /**
       * The object to which actions from the view should be sent.
       */
      target: any;
      /**
       * The controller's current model. When retrieving or modifying a controller's model, this property should be used instead of the `content` property.
       */
      model: any;
      /**
       * The collection of functions, keyed by name, available on this `ActionHandler` as action targets.
       */
      actions: {};
      /**
       * Triggers a named action on the `ActionHandler`. Any parameters supplied after the `actionName` string will be passed as arguments to the action target function.
       */
      send(actionName: string, context: any);
    }
    /**
     * Ember.Location returns an instance of the correct implementation of the `location` API.
     */
    export class Location {
    }
    /**
     * Ember.AutoLocation will select the best location option based off browser support with the priority order: history, hash, none.
     */
    export class AutoLocation {
    }
    /**
     * `Ember.HashLocation` implements the location API using the browser's hash. At present, it relies on a `hashchange` event existing in the browser.
     */
    export class HashLocation extends Object {
    }
    /**
     * Ember.HistoryLocation implements the location API using the browser's history.pushState API.
     */
    export class HistoryLocation extends Object {
    }
    /**
     * Ember.NoneLocation does not interact with the browser. It is useful for testing, or when you need to manage state with your Router, but temporarily don't want it to muck with the URL (for example when you embed your application in a larger page).
     */
    export class NoneLocation extends Object {
    }
    /**
     * The `Ember.Route` class is used to define individual routes. Refer to the [routing guide](http://emberjs.com/guides/routing/) for documentation.
     */
    export class Route extends Object implements ActionHandler, Evented {
      /**
       * Configuration hash for this route's queryParams. The possible configuration options and their defaults are as follows (assuming a query param whose controller property is `page`):
       */
      queryParams: {};
      /**
       * The name of the route, dot-delimited.
       */
      routeName: string;
      /**
       * Retrieves parameters, for current route using the state.params variable and getQueryParamsFor, using the supplied routeName.
       */
      paramsFor(name: string);
      /**
       * A hook you can use to reset controller values either when the model changes or the route is exiting.
       */
      resetController(controller: Controller, isExiting: boolean, transition: {});
      /**
       * The name of the view to use by default when rendering this routes template.
       */
      viewName: string;
      /**
       * The name of the template to use by default when rendering this routes template.
       */
      templateName: string;
      /**
       * The name of the controller to associate with this route.
       */
      controllerName: string;
      /**
       * The controller associated with this route.
       */
      controller: Controller;
      /**
       * This hook is executed when the router completely exits this route. It is not executed when the model for the route changes.
       */
      deactivate();
      /**
       * This hook is executed when the router enters the route. It is not executed when the model for the route changes.
       */
      activate();
      /**
       * Transition the application into another route. The route may be either a single route or route path:
       */
      transitionTo(name: string, ...models: any[]): Transition;
      transitionTo(name: string, options: {}): Transition;
      /**
       * Perform a synchronous transition into another route without attempting to resolve promises, update the URL, or abort any currently active asynchronous transitions (i.e. regular transitions caused by `transitionTo` or URL changes).
       */
      intermediateTransitionTo(name: string, ...models: any[]);
      /**
       * Refresh the model on this route and any child routes, firing the `beforeModel`, `model`, and `afterModel` hooks in a similar fashion to how routes are entered when transitioning in from other route. The current route params (e.g. `article_id`) will be passed in to the respective model hooks, and if a different model is returned, `setupController` and associated route hooks will re-fire as well.
       */
      refresh(): Transition;
      /**
       * Transition into another route while replacing the current URL, if possible. This will replace the current history entry instead of adding a new one. Beside that, it is identical to `transitionTo` in all other respects. See 'transitionTo' for additional information regarding multiple models.
       */
      replaceWith(name: string, ...models: any[]): Transition;
      /**
       * Sends an action to the router, which will delegate it to the currently active route hierarchy per the bubbling rules explained under `actions`.
       */
      send(name: string, ...args: any[]);
      /**
       * This hook is the first of the route entry validation hooks called when an attempt is made to transition into a route or one of its children. It is called before `model` and `afterModel`, and is appropriate for cases when:
       */
      beforeModel(transition: Transition): Promise<any>;
      /**
       * This hook is called after this route's model has resolved. It follows identical async/promise semantics to `beforeModel` but is provided the route's resolved model in addition to the `transition`, and is therefore suited to performing logic that can only take place after the model has already resolved.
       */
      afterModel(resolvedModel: {}, transition: Transition): Promise<any>;
      /**
       * A hook you can implement to optionally redirect to another route.
       */
      redirect(model: {}, transition: Transition);
      /**
       * A hook you can implement to convert the URL into the model for this route.
       */
      model(params: {}, transition: Transition): {}|Promise<any>;
      /**
       * A hook you can implement to convert the route's model into parameters for the URL.
       */
      serialize(model: {}, params: Ember.Array): {};
      /**
       * A hook you can use to setup the controller for the current route.
       */
      setupController(controller: Controller, model: {});
      /**
       * Returns the controller for a particular route or name.
       */
      controllerFor(name: string): Controller;
      /**
       * Returns the resolved model of a parent (or any ancestor) route in a route hierarchy.  During a transition, all routes must resolve a model object, and if a route needs access to a parent route's model in order to resolve a model (or just reuse the model from a parent), it can call `this.modelFor(theNameOfParentRoute)` to retrieve it. If the ancestor route's model was a promise, its resolved result is returned.
       */
      modelFor(name: string): {};
      /**
       * A hook you can use to render the template for the current route.
       */
      renderTemplate(controller: {}, model: {});
      /**
       * `render` is used to render a template into a region of another template (indicated by an `{{outlet}}`). `render` is used both during the entry phase of routing (via the `renderTemplate` hook) and later in response to user interaction.
       */
      render(name: string, options: {});
      /**
       * Disconnects a view that has been rendered into an outlet.
       */
      disconnectOutlet(options: {}|string);
      /**
       * The collection of functions, keyed by name, available on this `ActionHandler` as action targets.
       */
      actions: {};
      /**
       * Subscribes to a named event with given function.
       */
      on(name: string, target: {}, method: Function): void;
      /**
       * Subscribes a function to a named event and then cancels the subscription after the first time the event is triggered. It is good to use ``one`` when you only care about the first time an event has taken place.
       */
      one(name: string, target: {}, method: Function): void;
      /**
       * Triggers a named event for the object. Any additional arguments will be passed as parameters to the functions that are subscribed to the event.
       */
      trigger(name: string, ...args: any[]);
      /**
       * Cancels subscription for given name, target, and method.
       */
      off(name: string, target: {}, method: Function): void;
      /**
       * Checks to see if object has any subscriptions for named event.
       */
      has(name: string): boolean;
    }
    /**
     * The `Ember.Router` class manages the application state and URLs. Refer to the [routing guide](http://emberjs.com/guides/routing/) for documentation.
     */
    export class Router extends Object implements Evented {
      /**
       * The `location` property determines the type of URL's that your application will use.
       */
      location: any;
      /**
       * Represents the URL of the root of the application, often '/'. This prefix is assumed on all routes defined on this router.
       */
      rootURL: any;
      /**
       * Handles updating the paths and notifying any listeners of the URL change.
       */
      didTransition();
      /**
       * Handles notifying any listeners of an impending URL change.
       */
      willTransition();
      /**
       * The `Router.map` function allows you to define mappings from URLs to routes in your application. These mappings are defined within the supplied callback function using `this.route`.
       */
      map(callback: any);
      /**
       * Subscribes to a named event with given function.
       */
      on(name: string, target: {}, method: Function): void;
      /**
       * Subscribes a function to a named event and then cancels the subscription after the first time the event is triggered. It is good to use ``one`` when you only care about the first time an event has taken place.
       */
      one(name: string, target: {}, method: Function): void;
      /**
       * Triggers a named event for the object. Any additional arguments will be passed as parameters to the functions that are subscribed to the event.
       */
      trigger(name: string, ...args: any[]);
      /**
       * Cancels subscription for given name, target, and method.
       */
      off(name: string, target: {}, method: Function): void;
      /**
       * Checks to see if object has any subscriptions for named event.
       */
      has(name: string): boolean;
    }
    /**
     * `Ember.LinkComponent` renders an element whose `click` event triggers a transition of the application's instance of `Ember.Router` to a supplied route by name.
     */
    export class LinkComponent extends Component {
      /**
       * Used to determine when this `LinkComponent` is active.
       */
      currentWhen: any;
      /**
       * Sets the `title` attribute of the `LinkComponent`'s HTML element.
       */
      title: any;
      /**
       * Sets the `rel` attribute of the `LinkComponent`'s HTML element.
       */
      rel: any;
      /**
       * Sets the `tabindex` attribute of the `LinkComponent`'s HTML element.
       */
      tabindex: any;
      /**
       * Sets the `target` attribute of the `LinkComponent`'s HTML element.
       */
      target: any;
      /**
       * Determines whether the `LinkComponent` will trigger routing via the `replaceWith` routing strategy.
       */
      replace: boolean;
      /**
       * By default the `{{link-to}}` component will bind to the `href` and `title` attributes. It's discouraged that you override these defaults, however you can push onto the array if needed.
       */
      attributeBindings: Ember.Array;
      /**
       * By default the `{{link-to}}` component will bind to the `active`, `loading`, and `disabled` classes. It is discouraged to override these directly.
       */
      classNameBindings: Ember.Array;
    }
    export class Controller extends Object implements ControllerMixin {
      /**
       * Defines which query parameters the controller accepts. If you give the names `['category','page']` it will bind the values of these query parameters to the variables `this.category` and `this.page`
       */
      queryParams: any;
      /**
       * Transition the application into another route. The route may be either a single route or route path:
       */
      transitionToRoute(name: string, ...models: any[]);
      transitionToRoute(name: string, options: {});
      /**
       * The object to which actions from the view should be sent.
       */
      target: any;
      /**
       * The controller's current model. When retrieving or modifying a controller's model, this property should be used instead of the `content` property.
       */
      model: any;
      /**
       * The collection of functions, keyed by name, available on this `ActionHandler` as action targets.
       */
      actions: {};
      /**
       * Triggers a named action on the `ActionHandler`. Any parameters supplied after the `actionName` string will be passed as arguments to the action target function.
       */
      send(actionName: string, context: any);
    }
    /**
     * Namespace for injection helper methods.
     */
    export class inject {
      /**
       * Creates a property that lazily looks up another controller in the container. Can only be used when defining another controller.
       */
      controller(name: string): InjectedProperty;
      /**
       * Creates a property that lazily looks up a service in the container. There are no restrictions as to what objects a service can be injected into.
       */
      service(name: string): InjectedProperty;
    }
    /**
     * `Ember.ProxyMixin` forwards all properties not defined by the proxy itself to a proxied `content` object.  See Ember.ObjectProxy for more details.
     */
    export class ProxyMixin {
    }
    /**
     * `Ember.ActionHandler` is available on some familiar classes including `Ember.Route`, `Ember.View`, `Ember.Component`, and `Ember.Controller`. (Internally the mixin is used by `Ember.CoreView`, `Ember.ControllerMixin`, and `Ember.Route` and available to the above classes through inheritance.)
     */
    export class ActionHandler {
      /**
       * The collection of functions, keyed by name, available on this `ActionHandler` as action targets.
       */
      actions: {};
      /**
       * Triggers a named action on the `ActionHandler`. Any parameters supplied after the `actionName` string will be passed as arguments to the action target function.
       */
      send(actionName: string, context: any);
    }
    /**
     * This mixin implements Observer-friendly Array-like behavior. It is not a concrete implementation, but it can be used up by other classes that want to appear like arrays.
     */
    export class Array implements Enumerable {
      /**
       * __Required.__ You must implement this method to apply this mixin.
       */
      length: number;
      /**
       * Returns the object at the given `index`. If the given `index` is negative or is greater or equal than the array length, returns `undefined`.
       */
      objectAt(idx: number): any;
      /**
       * This returns the objects at the specified indexes, using `objectAt`.
       */
      objectsAt(indexes: Ember.Array): Ember.Array;
      /**
       * This is the handler for the special array content property. If you get this property, it will return this. If you set this property to a new array, it will replace the current content.
       */
      '[]': any;
      /**
       * Returns a new array that is a slice of the receiver. This implementation uses the observable array methods to retrieve the objects for the new slice.
       */
      slice(beginIndex: number, endIndex: number): Ember.Array;
      /**
       * Returns the index of the given object's first occurrence. If no `startAt` argument is given, the starting location to search is 0. If it's negative, will count backward from the end of the array. Returns -1 if no match is found.
       */
      indexOf(object: {}, startAt: number): number;
      /**
       * Returns the index of the given object's last occurrence. If no `startAt` argument is given, the search starts from the last position. If it's negative, will count backward from the end of the array. Returns -1 if no match is found.
       */
      lastIndexOf(object: {}, startAt: number): number;
      /**
       * Adds an array observer to the receiving array. The array observer object normally must implement two methods:
       */
      addArrayObserver(target: {}, opts: {}): Ember.Array;
      /**
       * Removes an array observer from the object if the observer is current registered. Calling this method multiple times with the same object will have no effect.
       */
      removeArrayObserver(target: {}, opts: {}): Ember.Array;
      /**
       * Becomes true whenever the array currently has observers watching changes on the array.
       */
      hasArrayObservers: boolean;
      /**
       * If you are implementing an object that supports `Ember.Array`, call this method just before the array content changes to notify any observers and invalidate any related properties. Pass the starting index of the change as well as a delta of the amounts to change.
       */
      arrayContentWillChange(startIdx: number, removeAmt: number, addAmt: number): Ember.Array;
      /**
       * If you are implementing an object that supports `Ember.Array`, call this method just after the array content changes to notify any observers and invalidate any related properties. Pass the starting index of the change as well as a delta of the amounts to change.
       */
      arrayContentDidChange(startIdx: number, removeAmt: number, addAmt: number): Ember.Array;
      /**
       * Returns a special object that can be used to observe individual properties on the array. Just get an equivalent property on this object and it will return an enumerable that maps automatically to the named key on the member objects.
       */
      '@each': any;
      /**
       * Helper method returns the first object from a collection. This is usually used by bindings and other parts of the framework to extract a single object if the enumerable contains only one item.
       */
      firstObject: any;
      /**
       * Helper method returns the last object from a collection. If your enumerable contains only one object, this method should always return that object. If your enumerable is empty, this method should return `undefined`.
       */
      lastObject: any;
      /**
       * Returns `true` if the passed object can be found in the receiver. The default version will iterate through the enumerable until the object is found. You may want to override this with a more efficient version.
       */
      contains(obj: {}): boolean;
      /**
       * Iterates through the enumerable, calling the passed function on each item. This method corresponds to the `forEach()` method defined in JavaScript 1.6.
       */
      forEach(callback: Function, target: {}): {};
      /**
       * Alias for `mapBy`
       */
      getEach(key: string): Ember.Array;
      /**
       * Sets the value on the named property for each member. This is more efficient than using other methods defined on this helper. If the object implements Ember.Observable, the value will be changed to `set(),` otherwise it will be set directly. `null` objects are skipped.
       */
      setEach(key: string, value: {}): {};
      /**
       * Maps all of the items in the enumeration to another value, returning a new array. This method corresponds to `map()` defined in JavaScript 1.6.
       */
      map(callback: Function, target: {}): Ember.Array;
      /**
       * Similar to map, this specialized function returns the value of the named property on all items in the enumeration.
       */
      mapBy(key: string): Ember.Array;
      /**
       * Returns an array with all of the items in the enumeration that the passed function returns true for. This method corresponds to `filter()` defined in JavaScript 1.6.
       */
      filter(callback: Function, target: {}): Ember.Array;
      /**
       * Returns an array with all of the items in the enumeration where the passed function returns false. This method is the inverse of filter().
       */
      reject(callback: Function, target: {}): Ember.Array;
      /**
       * Returns an array with just the items with the matched property. You can pass an optional second argument with the target value. Otherwise this will match any property that evaluates to `true`.
       */
      filterBy(key: string, value: any): Ember.Array;
      /**
       * Returns an array with the items that do not have truthy values for key.  You can pass an optional second argument with the target value.  Otherwise this will match any property that evaluates to false.
       */
      rejectBy(key: string, value: string): Ember.Array;
      /**
       * Returns the first item in the array for which the callback returns true. This method works similar to the `filter()` method defined in JavaScript 1.6 except that it will stop working on the array once a match is found.
       */
      find(callback: Function, target: {}): {};
      /**
       * Returns the first item with a property matching the passed value. You can pass an optional second argument with the target value. Otherwise this will match any property that evaluates to `true`.
       */
      findBy(key: string, value: string): {};
      /**
       * Returns `true` if the passed function returns true for every item in the enumeration. This corresponds with the `every()` method in JavaScript 1.6.
       */
      every(callback: Function, target: {}): boolean;
      /**
       * Returns `true` if the passed property resolves to the value of the second argument for all items in the enumerable. This method is often simpler/faster than using a callback.
       */
      isEvery(key: string, value: string): boolean;
      /**
       * Returns `true` if the passed function returns true for any item in the enumeration. This corresponds with the `some()` method in JavaScript 1.6.
       */
      any(callback: Function, target: {}): boolean;
      /**
       * Returns `true` if the passed property resolves to the value of the second argument for any item in the enumerable. This method is often simpler/faster than using a callback.
       */
      isAny(key: string, value: string): boolean;
      /**
       * This will combine the values of the enumerator into a single value. It is a useful way to collect a summary value from an enumeration. This corresponds to the `reduce()` method defined in JavaScript 1.8.
       */
      reduce(callback: Function, initialValue: {}, reducerProperty: string): {};
      /**
       * Invokes the named method on every object in the receiver that implements it. This method corresponds to the implementation in Prototype 1.6.
       */
      invoke(methodName: string, ...args: any[]): Ember.Array;
      /**
       * Simply converts the enumerable into a genuine array. The order is not guaranteed. Corresponds to the method implemented by Prototype.
       */
      toArray(): Ember.Array;
      /**
       * Returns a copy of the array with all `null` and `undefined` elements removed.
       */
      compact(): Ember.Array;
      /**
       * Returns a new enumerable that excludes the passed value. The default implementation returns an array regardless of the receiver type unless the receiver does not contain the value.
       */
      without(value: {}): Enumerable;
      /**
       * Returns a new enumerable that contains only unique values. The default implementation returns an array regardless of the receiver type.
       */
      uniq(): Enumerable;
      /**
       * Converts the enumerable into an array and sorts by the keys specified in the argument.
       */
      sortBy(property: string): Ember.Array;
    }
    /**
     * Implements some standard methods for comparing objects. Add this mixin to any class you create that can compare its instances.
     */
    export class Comparable {
    }
    /**
     * Implements some standard methods for copying an object. Add this mixin to any object you create that can create a copy of itself. This mixin is added automatically to the built-in array.
     */
    export class Copyable {
    }
    /**
     * This mixin defines the common interface implemented by enumerable objects in Ember. Most of these methods follow the standard Array iteration API defined up to JavaScript 1.8 (excluding language-specific features that cannot be emulated in older versions of JavaScript).
     */
    export class Enumerable {
      /**
       * Helper method returns the first object from a collection. This is usually used by bindings and other parts of the framework to extract a single object if the enumerable contains only one item.
       */
      firstObject: any;
      /**
       * Helper method returns the last object from a collection. If your enumerable contains only one object, this method should always return that object. If your enumerable is empty, this method should return `undefined`.
       */
      lastObject: any;
      /**
       * Returns `true` if the passed object can be found in the receiver. The default version will iterate through the enumerable until the object is found. You may want to override this with a more efficient version.
       */
      contains(obj: {}): boolean;
      /**
       * Iterates through the enumerable, calling the passed function on each item. This method corresponds to the `forEach()` method defined in JavaScript 1.6.
       */
      forEach(callback: Function, target: {}): {};
      /**
       * Alias for `mapBy`
       */
      getEach(key: string): Ember.Array;
      /**
       * Sets the value on the named property for each member. This is more efficient than using other methods defined on this helper. If the object implements Ember.Observable, the value will be changed to `set(),` otherwise it will be set directly. `null` objects are skipped.
       */
      setEach(key: string, value: {}): {};
      /**
       * Maps all of the items in the enumeration to another value, returning a new array. This method corresponds to `map()` defined in JavaScript 1.6.
       */
      map(callback: Function, target: {}): Ember.Array;
      /**
       * Similar to map, this specialized function returns the value of the named property on all items in the enumeration.
       */
      mapBy(key: string): Ember.Array;
      /**
       * Returns an array with all of the items in the enumeration that the passed function returns true for. This method corresponds to `filter()` defined in JavaScript 1.6.
       */
      filter(callback: Function, target: {}): Ember.Array;
      /**
       * Returns an array with all of the items in the enumeration where the passed function returns false. This method is the inverse of filter().
       */
      reject(callback: Function, target: {}): Ember.Array;
      /**
       * Returns an array with just the items with the matched property. You can pass an optional second argument with the target value. Otherwise this will match any property that evaluates to `true`.
       */
      filterBy(key: string, value: any): Ember.Array;
      /**
       * Returns an array with the items that do not have truthy values for key.  You can pass an optional second argument with the target value.  Otherwise this will match any property that evaluates to false.
       */
      rejectBy(key: string, value: string): Ember.Array;
      /**
       * Returns the first item in the array for which the callback returns true. This method works similar to the `filter()` method defined in JavaScript 1.6 except that it will stop working on the array once a match is found.
       */
      find(callback: Function, target: {}): {};
      /**
       * Returns the first item with a property matching the passed value. You can pass an optional second argument with the target value. Otherwise this will match any property that evaluates to `true`.
       */
      findBy(key: string, value: string): {};
      /**
       * Returns `true` if the passed function returns true for every item in the enumeration. This corresponds with the `every()` method in JavaScript 1.6.
       */
      every(callback: Function, target: {}): boolean;
      /**
       * Returns `true` if the passed property resolves to the value of the second argument for all items in the enumerable. This method is often simpler/faster than using a callback.
       */
      isEvery(key: string, value: string): boolean;
      /**
       * Returns `true` if the passed function returns true for any item in the enumeration. This corresponds with the `some()` method in JavaScript 1.6.
       */
      any(callback: Function, target: {}): boolean;
      /**
       * Returns `true` if the passed property resolves to the value of the second argument for any item in the enumerable. This method is often simpler/faster than using a callback.
       */
      isAny(key: string, value: string): boolean;
      /**
       * This will combine the values of the enumerator into a single value. It is a useful way to collect a summary value from an enumeration. This corresponds to the `reduce()` method defined in JavaScript 1.8.
       */
      reduce(callback: Function, initialValue: {}, reducerProperty: string): {};
      /**
       * Invokes the named method on every object in the receiver that implements it. This method corresponds to the implementation in Prototype 1.6.
       */
      invoke(methodName: string, ...args: any[]): Ember.Array;
      /**
       * Simply converts the enumerable into a genuine array. The order is not guaranteed. Corresponds to the method implemented by Prototype.
       */
      toArray(): Ember.Array;
      /**
       * Returns a copy of the array with all `null` and `undefined` elements removed.
       */
      compact(): Ember.Array;
      /**
       * Returns a new enumerable that excludes the passed value. The default implementation returns an array regardless of the receiver type unless the receiver does not contain the value.
       */
      without(value: {}): Enumerable;
      /**
       * Returns a new enumerable that contains only unique values. The default implementation returns an array regardless of the receiver type.
       */
      uniq(): Enumerable;
      /**
       * Converts the enumerable into an array and sorts by the keys specified in the argument.
       */
      sortBy(property: string): Ember.Array;
    }
    /**
     * This mixin allows for Ember objects to subscribe to and emit events.
     */
    export class Evented {
      /**
       * Subscribes to a named event with given function.
       */
      on(name: string, target: {}, method: Function): void;
      /**
       * Subscribes a function to a named event and then cancels the subscription after the first time the event is triggered. It is good to use ``one`` when you only care about the first time an event has taken place.
       */
      one(name: string, target: {}, method: Function): void;
      /**
       * Triggers a named event for the object. Any additional arguments will be passed as parameters to the functions that are subscribed to the event.
       */
      trigger(name: string, ...args: any[]);
      /**
       * Cancels subscription for given name, target, and method.
       */
      off(name: string, target: {}, method: Function): void;
      /**
       * Checks to see if object has any subscriptions for named event.
       */
      has(name: string): boolean;
    }
    /**
     * DEPRECATED: Use `Object.freeze` instead.
     * The `Ember.Freezable` mixin implements some basic methods for marking an object as frozen. Once an object is frozen it should be read only. No changes may be made the internal state of the object.
     */
    export class Freezable {
    }
    /**
     * This mixin defines the API for modifying array-like objects. These methods can be applied only to a collection that keeps its items in an ordered set. It builds upon the Array mixin and adds methods to modify the array. One concrete implementations of this class include ArrayProxy.
     */
    export class MutableArray implements Ember.Array, MutableEnumerable {
      /**
       * __Required.__ You must implement this method to apply this mixin.
       */
      replace(idx: number, amt: number, objects: Ember.Array);
      /**
       * Remove all elements from the array. This is useful if you want to reuse an existing array without having to recreate it.
       */
      clear(): Ember.Array;
      /**
       * This will use the primitive `replace()` method to insert an object at the specified index.
       */
      insertAt(idx: number, object: {}): Ember.Array;
      /**
       * Remove an object at the specified index using the `replace()` primitive method. You can pass either a single index, or a start and a length.
       */
      removeAt(start: number, len: number): Ember.Array;
      /**
       * Push the object onto the end of the array. Works just like `push()` but it is KVO-compliant.
       */
      pushObject(obj: any): void;
      /**
       * Add the objects in the passed numerable to the end of the array. Defers notifying observers of the change until all objects are added.
       */
      pushObjects(objects: Enumerable): Ember.Array;
      /**
       * Pop object from array or nil if none are left. Works just like `pop()` but it is KVO-compliant.
       */
      popObject(): void;
      /**
       * Shift an object from start of array or nil if none are left. Works just like `shift()` but it is KVO-compliant.
       */
      shiftObject(): void;
      /**
       * Unshift an object to start of array. Works just like `unshift()` but it is KVO-compliant.
       */
      unshiftObject(obj: any): void;
      /**
       * Adds the named objects to the beginning of the array. Defers notifying observers until all objects have been added.
       */
      unshiftObjects(objects: Enumerable): Ember.Array;
      /**
       * Reverse objects in the array. Works just like `reverse()` but it is KVO-compliant.
       */
      reverseObjects(): Ember.Array;
      /**
       * Replace all the receiver's content with content of the argument. If argument is an empty array receiver will be cleared.
       */
      setObjects(objects: Ember.Array): Ember.Array;
      /**
       * Remove all occurrences of an object in the array.
       */
      removeObject(obj: any): Ember.Array;
      /**
       * Push the object onto the end of the array if it is not already present in the array.
       */
      addObject(obj: any): Ember.Array;
      /**
       * __Required.__ You must implement this method to apply this mixin.
       */
      length: number;
      /**
       * Returns the object at the given `index`. If the given `index` is negative or is greater or equal than the array length, returns `undefined`.
       */
      objectAt(idx: number): any;
      /**
       * This returns the objects at the specified indexes, using `objectAt`.
       */
      objectsAt(indexes: Ember.Array): Ember.Array;
      /**
       * This is the handler for the special array content property. If you get this property, it will return this. If you set this property to a new array, it will replace the current content.
       */
      '[]': any;
      /**
       * Returns a new array that is a slice of the receiver. This implementation uses the observable array methods to retrieve the objects for the new slice.
       */
      slice(beginIndex: number, endIndex: number): Ember.Array;
      /**
       * Returns the index of the given object's first occurrence. If no `startAt` argument is given, the starting location to search is 0. If it's negative, will count backward from the end of the array. Returns -1 if no match is found.
       */
      indexOf(object: {}, startAt: number): number;
      /**
       * Returns the index of the given object's last occurrence. If no `startAt` argument is given, the search starts from the last position. If it's negative, will count backward from the end of the array. Returns -1 if no match is found.
       */
      lastIndexOf(object: {}, startAt: number): number;
      /**
       * Adds an array observer to the receiving array. The array observer object normally must implement two methods:
       */
      addArrayObserver(target: {}, opts: {}): Ember.Array;
      /**
       * Removes an array observer from the object if the observer is current registered. Calling this method multiple times with the same object will have no effect.
       */
      removeArrayObserver(target: {}, opts: {}): Ember.Array;
      /**
       * Becomes true whenever the array currently has observers watching changes on the array.
       */
      hasArrayObservers: boolean;
      /**
       * If you are implementing an object that supports `Ember.Array`, call this method just before the array content changes to notify any observers and invalidate any related properties. Pass the starting index of the change as well as a delta of the amounts to change.
       */
      arrayContentWillChange(startIdx: number, removeAmt: number, addAmt: number): Ember.Array;
      /**
       * If you are implementing an object that supports `Ember.Array`, call this method just after the array content changes to notify any observers and invalidate any related properties. Pass the starting index of the change as well as a delta of the amounts to change.
       */
      arrayContentDidChange(startIdx: number, removeAmt: number, addAmt: number): Ember.Array;
      /**
       * Returns a special object that can be used to observe individual properties on the array. Just get an equivalent property on this object and it will return an enumerable that maps automatically to the named key on the member objects.
       */
      '@each': any;
      /**
       * Helper method returns the first object from a collection. This is usually used by bindings and other parts of the framework to extract a single object if the enumerable contains only one item.
       */
      firstObject: any;
      /**
       * Helper method returns the last object from a collection. If your enumerable contains only one object, this method should always return that object. If your enumerable is empty, this method should return `undefined`.
       */
      lastObject: any;
      /**
       * Returns `true` if the passed object can be found in the receiver. The default version will iterate through the enumerable until the object is found. You may want to override this with a more efficient version.
       */
      contains(obj: {}): boolean;
      /**
       * Iterates through the enumerable, calling the passed function on each item. This method corresponds to the `forEach()` method defined in JavaScript 1.6.
       */
      forEach(callback: Function, target: {}): {};
      /**
       * Alias for `mapBy`
       */
      getEach(key: string): Ember.Array;
      /**
       * Sets the value on the named property for each member. This is more efficient than using other methods defined on this helper. If the object implements Ember.Observable, the value will be changed to `set(),` otherwise it will be set directly. `null` objects are skipped.
       */
      setEach(key: string, value: {}): {};
      /**
       * Maps all of the items in the enumeration to another value, returning a new array. This method corresponds to `map()` defined in JavaScript 1.6.
       */
      map(callback: Function, target: {}): Ember.Array;
      /**
       * Similar to map, this specialized function returns the value of the named property on all items in the enumeration.
       */
      mapBy(key: string): Ember.Array;
      /**
       * Returns an array with all of the items in the enumeration that the passed function returns true for. This method corresponds to `filter()` defined in JavaScript 1.6.
       */
      filter(callback: Function, target: {}): Ember.Array;
      /**
       * Returns an array with all of the items in the enumeration where the passed function returns false. This method is the inverse of filter().
       */
      reject(callback: Function, target: {}): Ember.Array;
      /**
       * Returns an array with just the items with the matched property. You can pass an optional second argument with the target value. Otherwise this will match any property that evaluates to `true`.
       */
      filterBy(key: string, value: any): Ember.Array;
      /**
       * Returns an array with the items that do not have truthy values for key.  You can pass an optional second argument with the target value.  Otherwise this will match any property that evaluates to false.
       */
      rejectBy(key: string, value: string): Ember.Array;
      /**
       * Returns the first item in the array for which the callback returns true. This method works similar to the `filter()` method defined in JavaScript 1.6 except that it will stop working on the array once a match is found.
       */
      find(callback: Function, target: {}): {};
      /**
       * Returns the first item with a property matching the passed value. You can pass an optional second argument with the target value. Otherwise this will match any property that evaluates to `true`.
       */
      findBy(key: string, value: string): {};
      /**
       * Returns `true` if the passed function returns true for every item in the enumeration. This corresponds with the `every()` method in JavaScript 1.6.
       */
      every(callback: Function, target: {}): boolean;
      /**
       * Returns `true` if the passed property resolves to the value of the second argument for all items in the enumerable. This method is often simpler/faster than using a callback.
       */
      isEvery(key: string, value: string): boolean;
      /**
       * Returns `true` if the passed function returns true for any item in the enumeration. This corresponds with the `some()` method in JavaScript 1.6.
       */
      any(callback: Function, target: {}): boolean;
      /**
       * Returns `true` if the passed property resolves to the value of the second argument for any item in the enumerable. This method is often simpler/faster than using a callback.
       */
      isAny(key: string, value: string): boolean;
      /**
       * This will combine the values of the enumerator into a single value. It is a useful way to collect a summary value from an enumeration. This corresponds to the `reduce()` method defined in JavaScript 1.8.
       */
      reduce(callback: Function, initialValue: {}, reducerProperty: string): {};
      /**
       * Invokes the named method on every object in the receiver that implements it. This method corresponds to the implementation in Prototype 1.6.
       */
      invoke(methodName: string, ...args: any[]): Ember.Array;
      /**
       * Simply converts the enumerable into a genuine array. The order is not guaranteed. Corresponds to the method implemented by Prototype.
       */
      toArray(): Ember.Array;
      /**
       * Returns a copy of the array with all `null` and `undefined` elements removed.
       */
      compact(): Ember.Array;
      /**
       * Returns a new enumerable that excludes the passed value. The default implementation returns an array regardless of the receiver type unless the receiver does not contain the value.
       */
      without(value: {}): Enumerable;
      /**
       * Returns a new enumerable that contains only unique values. The default implementation returns an array regardless of the receiver type.
       */
      uniq(): Enumerable;
      /**
       * Converts the enumerable into an array and sorts by the keys specified in the argument.
       */
      sortBy(property: string): Ember.Array;
      /**
       * Adds each object in the passed enumerable to the receiver.
       */
      addObjects(objects: Enumerable): {};
      /**
       * Removes each object in the passed enumerable from the receiver.
       */
      removeObjects(objects: Enumerable): {};
    }
    /**
     * This mixin defines the API for modifying generic enumerables. These methods can be applied to an object regardless of whether it is ordered or unordered.
     */
    export class MutableEnumerable implements Enumerable {
      /**
       * __Required.__ You must implement this method to apply this mixin.
       */
      addObject(object: {}): {};
      /**
       * Adds each object in the passed enumerable to the receiver.
       */
      addObjects(objects: Enumerable): {};
      /**
       * __Required.__ You must implement this method to apply this mixin.
       */
      removeObject(object: {}): {};
      /**
       * Removes each object in the passed enumerable from the receiver.
       */
      removeObjects(objects: Enumerable): {};
      /**
       * Helper method returns the first object from a collection. This is usually used by bindings and other parts of the framework to extract a single object if the enumerable contains only one item.
       */
      firstObject: any;
      /**
       * Helper method returns the last object from a collection. If your enumerable contains only one object, this method should always return that object. If your enumerable is empty, this method should return `undefined`.
       */
      lastObject: any;
      /**
       * Returns `true` if the passed object can be found in the receiver. The default version will iterate through the enumerable until the object is found. You may want to override this with a more efficient version.
       */
      contains(obj: {}): boolean;
      /**
       * Iterates through the enumerable, calling the passed function on each item. This method corresponds to the `forEach()` method defined in JavaScript 1.6.
       */
      forEach(callback: Function, target: {}): {};
      /**
       * Alias for `mapBy`
       */
      getEach(key: string): Ember.Array;
      /**
       * Sets the value on the named property for each member. This is more efficient than using other methods defined on this helper. If the object implements Ember.Observable, the value will be changed to `set(),` otherwise it will be set directly. `null` objects are skipped.
       */
      setEach(key: string, value: {}): {};
      /**
       * Maps all of the items in the enumeration to another value, returning a new array. This method corresponds to `map()` defined in JavaScript 1.6.
       */
      map(callback: Function, target: {}): Ember.Array;
      /**
       * Similar to map, this specialized function returns the value of the named property on all items in the enumeration.
       */
      mapBy(key: string): Ember.Array;
      /**
       * Returns an array with all of the items in the enumeration that the passed function returns true for. This method corresponds to `filter()` defined in JavaScript 1.6.
       */
      filter(callback: Function, target: {}): Ember.Array;
      /**
       * Returns an array with all of the items in the enumeration where the passed function returns false. This method is the inverse of filter().
       */
      reject(callback: Function, target: {}): Ember.Array;
      /**
       * Returns an array with just the items with the matched property. You can pass an optional second argument with the target value. Otherwise this will match any property that evaluates to `true`.
       */
      filterBy(key: string, value: any): Ember.Array;
      /**
       * Returns an array with the items that do not have truthy values for key.  You can pass an optional second argument with the target value.  Otherwise this will match any property that evaluates to false.
       */
      rejectBy(key: string, value: string): Ember.Array;
      /**
       * Returns the first item in the array for which the callback returns true. This method works similar to the `filter()` method defined in JavaScript 1.6 except that it will stop working on the array once a match is found.
       */
      find(callback: Function, target: {}): {};
      /**
       * Returns the first item with a property matching the passed value. You can pass an optional second argument with the target value. Otherwise this will match any property that evaluates to `true`.
       */
      findBy(key: string, value: string): {};
      /**
       * Returns `true` if the passed function returns true for every item in the enumeration. This corresponds with the `every()` method in JavaScript 1.6.
       */
      every(callback: Function, target: {}): boolean;
      /**
       * Returns `true` if the passed property resolves to the value of the second argument for all items in the enumerable. This method is often simpler/faster than using a callback.
       */
      isEvery(key: string, value: string): boolean;
      /**
       * Returns `true` if the passed function returns true for any item in the enumeration. This corresponds with the `some()` method in JavaScript 1.6.
       */
      any(callback: Function, target: {}): boolean;
      /**
       * Returns `true` if the passed property resolves to the value of the second argument for any item in the enumerable. This method is often simpler/faster than using a callback.
       */
      isAny(key: string, value: string): boolean;
      /**
       * This will combine the values of the enumerator into a single value. It is a useful way to collect a summary value from an enumeration. This corresponds to the `reduce()` method defined in JavaScript 1.8.
       */
      reduce(callback: Function, initialValue: {}, reducerProperty: string): {};
      /**
       * Invokes the named method on every object in the receiver that implements it. This method corresponds to the implementation in Prototype 1.6.
       */
      invoke(methodName: string, ...args: any[]): Ember.Array;
      /**
       * Simply converts the enumerable into a genuine array. The order is not guaranteed. Corresponds to the method implemented by Prototype.
       */
      toArray(): Ember.Array;
      /**
       * Returns a copy of the array with all `null` and `undefined` elements removed.
       */
      compact(): Ember.Array;
      /**
       * Returns a new enumerable that excludes the passed value. The default implementation returns an array regardless of the receiver type unless the receiver does not contain the value.
       */
      without(value: {}): Enumerable;
      /**
       * Returns a new enumerable that contains only unique values. The default implementation returns an array regardless of the receiver type.
       */
      uniq(): Enumerable;
      /**
       * Converts the enumerable into an array and sorts by the keys specified in the argument.
       */
      sortBy(property: string): Ember.Array;
    }
    /**
     * ## Overview
     */
    export class Observable {
      /**
       * Retrieves the value of a property from the object.
       */
      get(keyName: string): {};
      /**
       * To get the values of multiple properties at once, call `getProperties` with a list of strings or an array:
       */
      getProperties(...list: string[]): {};
      /**
       * Sets the provided key or path to the value.
       */
      set(keyName: string, value: {}): {};
      /**
       * Sets a list of properties at once. These properties are set inside a single `beginPropertyChanges` and `endPropertyChanges` batch, so observers will be buffered.
       */
      setProperties(hash: {}): {};
      /**
       * Convenience method to call `propertyWillChange` and `propertyDidChange` in succession.
       */
      notifyPropertyChange(keyName: string): Observable;
      /**
       * Adds an observer on a property.
       */
      addObserver(key: string, target: {}, method: string|Function);
      /**
       * Remove an observer you have previously registered on this object. Pass the same key, target, and method you passed to `addObserver()` and your target will no longer receive notifications.
       */
      removeObserver(key: string, target: {}, method: string|Function);
      /**
       * Retrieves the value of a property, or a default value in the case that the property returns `undefined`.
       */
      getWithDefault(keyName: string, defaultValue: {}): {};
      /**
       * Set the value of a property to the current value plus some amount.
       */
      incrementProperty(keyName: string, increment: number): number;
      /**
       * Set the value of a property to the current value minus some amount.
       */
      decrementProperty(keyName: string, decrement: number): number;
      /**
       * Set the value of a boolean property to the opposite of its current value.
       */
      toggleProperty(keyName: string): boolean;
      /**
       * Returns the cached value of a computed property, if it exists. This allows you to inspect the value of a computed property without accidentally invoking it if it is intended to be generated lazily.
       */
      cacheFor(keyName: string): {};
    }
    /**
     * A low level mixin making ObjectProxy promise-aware.
     */
    export class PromiseProxyMixin {
      /**
       * If the proxied promise is rejected this will contain the reason provided.
       */
      reason: any;
      /**
       * Once the proxied promise has settled this will become `false`.
       */
      isPending: any;
      /**
       * Once the proxied promise has settled this will become `true`.
       */
      isSettled: any;
      /**
       * Will become `true` if the proxied promise is rejected.
       */
      isRejected: any;
      /**
       * Will become `true` if the proxied promise is fulfilled.
       */
      isFulfilled: any;
      /**
       * The promise whose fulfillment value is being proxied by this object.
       */
      promise: any;
      /**
       * An alias to the proxied promise's `then`.
       */
      then(callback: Function): RSVP.Promise<any>;
      /**
       * An alias to the proxied promise's `catch`.
       */
      catch(callback: Function): RSVP.Promise<any>;
      /**
       * An alias to the proxied promise's `finally`.
       */
      finally(callback: Function): RSVP.Promise<any>;
    }
    /**
     * `Ember.TargetActionSupport` is a mixin that can be included in a class to add a `triggerAction` method with semantics similar to the Handlebars `{{action}}` helper. In normal Ember usage, the `{{action}}` helper is usually the best choice. This mixin is most often useful when you are doing more complex event handling in View objects.
     */
    export class TargetActionSupport extends Mixin {
    }
    /**
     * An ArrayProxy wraps any other object that implements `Ember.Array` and/or `Ember.MutableArray,` forwarding all requests. This makes it very useful for a number of binding use cases or other cases where being able to swap out the underlying array is useful.
     */
    export class ArrayProxy extends Object implements MutableArray {
      /**
       * __Required.__ You must implement this method to apply this mixin.
       */
      replace(idx: number, amt: number, objects: Ember.Array);
      /**
       * Remove all elements from the array. This is useful if you want to reuse an existing array without having to recreate it.
       */
      clear(): Ember.Array;
      /**
       * This will use the primitive `replace()` method to insert an object at the specified index.
       */
      insertAt(idx: number, object: {}): Ember.Array;
      /**
       * Remove an object at the specified index using the `replace()` primitive method. You can pass either a single index, or a start and a length.
       */
      removeAt(start: number, len: number): Ember.Array;
      /**
       * Push the object onto the end of the array. Works just like `push()` but it is KVO-compliant.
       */
      pushObject(obj: any): void;
      /**
       * Add the objects in the passed numerable to the end of the array. Defers notifying observers of the change until all objects are added.
       */
      pushObjects(objects: Enumerable): Ember.Array;
      /**
       * Pop object from array or nil if none are left. Works just like `pop()` but it is KVO-compliant.
       */
      popObject(): void;
      /**
       * Shift an object from start of array or nil if none are left. Works just like `shift()` but it is KVO-compliant.
       */
      shiftObject(): void;
      /**
       * Unshift an object to start of array. Works just like `unshift()` but it is KVO-compliant.
       */
      unshiftObject(obj: any): void;
      /**
       * Adds the named objects to the beginning of the array. Defers notifying observers until all objects have been added.
       */
      unshiftObjects(objects: Enumerable): Ember.Array;
      /**
       * Reverse objects in the array. Works just like `reverse()` but it is KVO-compliant.
       */
      reverseObjects(): Ember.Array;
      /**
       * Replace all the receiver's content with content of the argument. If argument is an empty array receiver will be cleared.
       */
      setObjects(objects: Ember.Array): Ember.Array;
      /**
       * Remove all occurrences of an object in the array.
       */
      removeObject(obj: any): Ember.Array;
      /**
       * Push the object onto the end of the array if it is not already present in the array.
       */
      addObject(obj: any): Ember.Array;
      /**
       * __Required.__ You must implement this method to apply this mixin.
       */
      length: number;
      /**
       * Returns the object at the given `index`. If the given `index` is negative or is greater or equal than the array length, returns `undefined`.
       */
      objectAt(idx: number): any;
      /**
       * This returns the objects at the specified indexes, using `objectAt`.
       */
      objectsAt(indexes: Ember.Array): Ember.Array;
      /**
       * This is the handler for the special array content property. If you get this property, it will return this. If you set this property to a new array, it will replace the current content.
       */
      '[]': any;
      /**
       * Returns a new array that is a slice of the receiver. This implementation uses the observable array methods to retrieve the objects for the new slice.
       */
      slice(beginIndex: number, endIndex: number): Ember.Array;
      /**
       * Returns the index of the given object's first occurrence. If no `startAt` argument is given, the starting location to search is 0. If it's negative, will count backward from the end of the array. Returns -1 if no match is found.
       */
      indexOf(object: {}, startAt: number): number;
      /**
       * Returns the index of the given object's last occurrence. If no `startAt` argument is given, the search starts from the last position. If it's negative, will count backward from the end of the array. Returns -1 if no match is found.
       */
      lastIndexOf(object: {}, startAt: number): number;
      /**
       * Adds an array observer to the receiving array. The array observer object normally must implement two methods:
       */
      addArrayObserver(target: {}, opts: {}): Ember.Array;
      /**
       * Removes an array observer from the object if the observer is current registered. Calling this method multiple times with the same object will have no effect.
       */
      removeArrayObserver(target: {}, opts: {}): Ember.Array;
      /**
       * Becomes true whenever the array currently has observers watching changes on the array.
       */
      hasArrayObservers: boolean;
      /**
       * If you are implementing an object that supports `Ember.Array`, call this method just before the array content changes to notify any observers and invalidate any related properties. Pass the starting index of the change as well as a delta of the amounts to change.
       */
      arrayContentWillChange(startIdx: number, removeAmt: number, addAmt: number): Ember.Array;
      /**
       * If you are implementing an object that supports `Ember.Array`, call this method just after the array content changes to notify any observers and invalidate any related properties. Pass the starting index of the change as well as a delta of the amounts to change.
       */
      arrayContentDidChange(startIdx: number, removeAmt: number, addAmt: number): Ember.Array;
      /**
       * Returns a special object that can be used to observe individual properties on the array. Just get an equivalent property on this object and it will return an enumerable that maps automatically to the named key on the member objects.
       */
      '@each': any;
      /**
       * Helper method returns the first object from a collection. This is usually used by bindings and other parts of the framework to extract a single object if the enumerable contains only one item.
       */
      firstObject: any;
      /**
       * Helper method returns the last object from a collection. If your enumerable contains only one object, this method should always return that object. If your enumerable is empty, this method should return `undefined`.
       */
      lastObject: any;
      /**
       * Returns `true` if the passed object can be found in the receiver. The default version will iterate through the enumerable until the object is found. You may want to override this with a more efficient version.
       */
      contains(obj: {}): boolean;
      /**
       * Iterates through the enumerable, calling the passed function on each item. This method corresponds to the `forEach()` method defined in JavaScript 1.6.
       */
      forEach(callback: Function, target: {}): {};
      /**
       * Alias for `mapBy`
       */
      getEach(key: string): Ember.Array;
      /**
       * Sets the value on the named property for each member. This is more efficient than using other methods defined on this helper. If the object implements Ember.Observable, the value will be changed to `set(),` otherwise it will be set directly. `null` objects are skipped.
       */
      setEach(key: string, value: {}): {};
      /**
       * Maps all of the items in the enumeration to another value, returning a new array. This method corresponds to `map()` defined in JavaScript 1.6.
       */
      map(callback: Function, target: {}): Ember.Array;
      /**
       * Similar to map, this specialized function returns the value of the named property on all items in the enumeration.
       */
      mapBy(key: string): Ember.Array;
      /**
       * Returns an array with all of the items in the enumeration that the passed function returns true for. This method corresponds to `filter()` defined in JavaScript 1.6.
       */
      filter(callback: Function, target: {}): Ember.Array;
      /**
       * Returns an array with all of the items in the enumeration where the passed function returns false. This method is the inverse of filter().
       */
      reject(callback: Function, target: {}): Ember.Array;
      /**
       * Returns an array with just the items with the matched property. You can pass an optional second argument with the target value. Otherwise this will match any property that evaluates to `true`.
       */
      filterBy(key: string, value: any): Ember.Array;
      /**
       * Returns an array with the items that do not have truthy values for key.  You can pass an optional second argument with the target value.  Otherwise this will match any property that evaluates to false.
       */
      rejectBy(key: string, value: string): Ember.Array;
      /**
       * Returns the first item in the array for which the callback returns true. This method works similar to the `filter()` method defined in JavaScript 1.6 except that it will stop working on the array once a match is found.
       */
      find(callback: Function, target: {}): {};
      /**
       * Returns the first item with a property matching the passed value. You can pass an optional second argument with the target value. Otherwise this will match any property that evaluates to `true`.
       */
      findBy(key: string, value: string): {};
      /**
       * Returns `true` if the passed function returns true for every item in the enumeration. This corresponds with the `every()` method in JavaScript 1.6.
       */
      every(callback: Function, target: {}): boolean;
      /**
       * Returns `true` if the passed property resolves to the value of the second argument for all items in the enumerable. This method is often simpler/faster than using a callback.
       */
      isEvery(key: string, value: string): boolean;
      /**
       * Returns `true` if the passed function returns true for any item in the enumeration. This corresponds with the `some()` method in JavaScript 1.6.
       */
      any(callback: Function, target: {}): boolean;
      /**
       * Returns `true` if the passed property resolves to the value of the second argument for any item in the enumerable. This method is often simpler/faster than using a callback.
       */
      isAny(key: string, value: string): boolean;
      /**
       * This will combine the values of the enumerator into a single value. It is a useful way to collect a summary value from an enumeration. This corresponds to the `reduce()` method defined in JavaScript 1.8.
       */
      reduce(callback: Function, initialValue: {}, reducerProperty: string): {};
      /**
       * Invokes the named method on every object in the receiver that implements it. This method corresponds to the implementation in Prototype 1.6.
       */
      invoke(methodName: string, ...args: any[]): Ember.Array;
      /**
       * Simply converts the enumerable into a genuine array. The order is not guaranteed. Corresponds to the method implemented by Prototype.
       */
      toArray(): Ember.Array;
      /**
       * Returns a copy of the array with all `null` and `undefined` elements removed.
       */
      compact(): Ember.Array;
      /**
       * Returns a new enumerable that excludes the passed value. The default implementation returns an array regardless of the receiver type unless the receiver does not contain the value.
       */
      without(value: {}): Enumerable;
      /**
       * Returns a new enumerable that contains only unique values. The default implementation returns an array regardless of the receiver type.
       */
      uniq(): Enumerable;
      /**
       * Converts the enumerable into an array and sorts by the keys specified in the argument.
       */
      sortBy(property: string): Ember.Array;
      /**
       * Adds each object in the passed enumerable to the receiver.
       */
      addObjects(objects: Enumerable): {};
      /**
       * Removes each object in the passed enumerable from the receiver.
       */
      removeObjects(objects: Enumerable): {};
    }
    export class CoreObject {
      /**
       * An overridable method called when objects are instantiated. By default, does nothing unless it is overridden during class definition.
       */
      init();
      /**
       * Defines the properties that will be concatenated from the superclass (instead of overridden).
       */
      concatenatedProperties: Ember.Array;
      /**
       * Defines the properties that will be merged from the superclass (instead of overridden).
       */
      mergedProperties: Ember.Array;
      /**
       * Destroyed object property flag.
       */
      isDestroyed: any;
      /**
       * Destruction scheduled flag. The `destroy()` method has been called.
       */
      isDestroying: any;
      /**
       * Destroys an object by setting the `isDestroyed` flag and removing its metadata, which effectively destroys observers and bindings.
       */
      destroy(): {};
      /**
       * Override to implement teardown.
       */
      willDestroy();
      /**
       * Returns a string representation which attempts to provide more information than Javascript's `toString` typically does, in a generic way for all Ember objects.
       */
      toString(): string;
      /**
       * Creates a new subclass.
       */
      static extend(mixins: Mixin, args: {});
      /**
       * Creates an instance of a class. Accepts either no arguments, or an object containing values to initialize the newly instantiated object with.
       */
      static create(args: any);
      /**
       * Augments a constructor's prototype with additional properties and functions:
       */
      reopen();
      /**
       * Augments a constructor's own properties and functions:
       */
      reopenClass();
    }
    /**
     * This is the object instance returned when you get the `@each` property on an array. It uses the unknownProperty handler to automatically create EachArray instances for property names.
     */
    export class EachProxy {
    }
    /**
     * A Namespace is an object usually used to contain other objects or methods such as an application or framework. Create a namespace anytime you want to define one of these new containers.
     */
    export class Namespace extends Object {
    }
    /**
     * The NativeArray mixin contains the properties needed to make the native Array support Ember.MutableArray and all of its dependent APIs. Unless you have `Ember.EXTEND_PROTOTYPES` or `Ember.EXTEND_PROTOTYPES.Array` set to false, this will be applied automatically. Otherwise you can apply the mixin at anytime by calling `Ember.NativeArray.activate`.
     */
    export class NativeArray implements MutableArray, Observable, Copyable {
      /**
       * __Required.__ You must implement this method to apply this mixin.
       */
      replace(idx: number, amt: number, objects: Ember.Array);
      /**
       * Remove all elements from the array. This is useful if you want to reuse an existing array without having to recreate it.
       */
      clear(): Ember.Array;
      /**
       * This will use the primitive `replace()` method to insert an object at the specified index.
       */
      insertAt(idx: number, object: {}): Ember.Array;
      /**
       * Remove an object at the specified index using the `replace()` primitive method. You can pass either a single index, or a start and a length.
       */
      removeAt(start: number, len: number): Ember.Array;
      /**
       * Push the object onto the end of the array. Works just like `push()` but it is KVO-compliant.
       */
      pushObject(obj: any): void;
      /**
       * Add the objects in the passed numerable to the end of the array. Defers notifying observers of the change until all objects are added.
       */
      pushObjects(objects: Enumerable): Ember.Array;
      /**
       * Pop object from array or nil if none are left. Works just like `pop()` but it is KVO-compliant.
       */
      popObject(): void;
      /**
       * Shift an object from start of array or nil if none are left. Works just like `shift()` but it is KVO-compliant.
       */
      shiftObject(): void;
      /**
       * Unshift an object to start of array. Works just like `unshift()` but it is KVO-compliant.
       */
      unshiftObject(obj: any): void;
      /**
       * Adds the named objects to the beginning of the array. Defers notifying observers until all objects have been added.
       */
      unshiftObjects(objects: Enumerable): Ember.Array;
      /**
       * Reverse objects in the array. Works just like `reverse()` but it is KVO-compliant.
       */
      reverseObjects(): Ember.Array;
      /**
       * Replace all the receiver's content with content of the argument. If argument is an empty array receiver will be cleared.
       */
      setObjects(objects: Ember.Array): Ember.Array;
      /**
       * Remove all occurrences of an object in the array.
       */
      removeObject(obj: any): Ember.Array;
      /**
       * Push the object onto the end of the array if it is not already present in the array.
       */
      addObject(obj: any): Ember.Array;
      /**
       * __Required.__ You must implement this method to apply this mixin.
       */
      length: number;
      /**
       * Returns the object at the given `index`. If the given `index` is negative or is greater or equal than the array length, returns `undefined`.
       */
      objectAt(idx: number): any;
      /**
       * This returns the objects at the specified indexes, using `objectAt`.
       */
      objectsAt(indexes: Ember.Array): Ember.Array;
      /**
       * This is the handler for the special array content property. If you get this property, it will return this. If you set this property to a new array, it will replace the current content.
       */
      '[]': any;
      /**
       * Returns a new array that is a slice of the receiver. This implementation uses the observable array methods to retrieve the objects for the new slice.
       */
      slice(beginIndex: number, endIndex: number): Ember.Array;
      /**
       * Returns the index of the given object's first occurrence. If no `startAt` argument is given, the starting location to search is 0. If it's negative, will count backward from the end of the array. Returns -1 if no match is found.
       */
      indexOf(object: {}, startAt: number): number;
      /**
       * Returns the index of the given object's last occurrence. If no `startAt` argument is given, the search starts from the last position. If it's negative, will count backward from the end of the array. Returns -1 if no match is found.
       */
      lastIndexOf(object: {}, startAt: number): number;
      /**
       * Adds an array observer to the receiving array. The array observer object normally must implement two methods:
       */
      addArrayObserver(target: {}, opts: {}): Ember.Array;
      /**
       * Removes an array observer from the object if the observer is current registered. Calling this method multiple times with the same object will have no effect.
       */
      removeArrayObserver(target: {}, opts: {}): Ember.Array;
      /**
       * Becomes true whenever the array currently has observers watching changes on the array.
       */
      hasArrayObservers: boolean;
      /**
       * If you are implementing an object that supports `Ember.Array`, call this method just before the array content changes to notify any observers and invalidate any related properties. Pass the starting index of the change as well as a delta of the amounts to change.
       */
      arrayContentWillChange(startIdx: number, removeAmt: number, addAmt: number): Ember.Array;
      /**
       * If you are implementing an object that supports `Ember.Array`, call this method just after the array content changes to notify any observers and invalidate any related properties. Pass the starting index of the change as well as a delta of the amounts to change.
       */
      arrayContentDidChange(startIdx: number, removeAmt: number, addAmt: number): Ember.Array;
      /**
       * Returns a special object that can be used to observe individual properties on the array. Just get an equivalent property on this object and it will return an enumerable that maps automatically to the named key on the member objects.
       */
      '@each': any;
      /**
       * Helper method returns the first object from a collection. This is usually used by bindings and other parts of the framework to extract a single object if the enumerable contains only one item.
       */
      firstObject: any;
      /**
       * Helper method returns the last object from a collection. If your enumerable contains only one object, this method should always return that object. If your enumerable is empty, this method should return `undefined`.
       */
      lastObject: any;
      /**
       * Returns `true` if the passed object can be found in the receiver. The default version will iterate through the enumerable until the object is found. You may want to override this with a more efficient version.
       */
      contains(obj: {}): boolean;
      /**
       * Iterates through the enumerable, calling the passed function on each item. This method corresponds to the `forEach()` method defined in JavaScript 1.6.
       */
      forEach(callback: Function, target: {}): {};
      /**
       * Alias for `mapBy`
       */
      getEach(key: string): Ember.Array;
      /**
       * Sets the value on the named property for each member. This is more efficient than using other methods defined on this helper. If the object implements Ember.Observable, the value will be changed to `set(),` otherwise it will be set directly. `null` objects are skipped.
       */
      setEach(key: string, value: {}): {};
      /**
       * Maps all of the items in the enumeration to another value, returning a new array. This method corresponds to `map()` defined in JavaScript 1.6.
       */
      map(callback: Function, target: {}): Ember.Array;
      /**
       * Similar to map, this specialized function returns the value of the named property on all items in the enumeration.
       */
      mapBy(key: string): Ember.Array;
      /**
       * Returns an array with all of the items in the enumeration that the passed function returns true for. This method corresponds to `filter()` defined in JavaScript 1.6.
       */
      filter(callback: Function, target: {}): Ember.Array;
      /**
       * Returns an array with all of the items in the enumeration where the passed function returns false. This method is the inverse of filter().
       */
      reject(callback: Function, target: {}): Ember.Array;
      /**
       * Returns an array with just the items with the matched property. You can pass an optional second argument with the target value. Otherwise this will match any property that evaluates to `true`.
       */
      filterBy(key: string, value: any): Ember.Array;
      /**
       * Returns an array with the items that do not have truthy values for key.  You can pass an optional second argument with the target value.  Otherwise this will match any property that evaluates to false.
       */
      rejectBy(key: string, value: string): Ember.Array;
      /**
       * Returns the first item in the array for which the callback returns true. This method works similar to the `filter()` method defined in JavaScript 1.6 except that it will stop working on the array once a match is found.
       */
      find(callback: Function, target: {}): {};
      /**
       * Returns the first item with a property matching the passed value. You can pass an optional second argument with the target value. Otherwise this will match any property that evaluates to `true`.
       */
      findBy(key: string, value: string): {};
      /**
       * Returns `true` if the passed function returns true for every item in the enumeration. This corresponds with the `every()` method in JavaScript 1.6.
       */
      every(callback: Function, target: {}): boolean;
      /**
       * Returns `true` if the passed property resolves to the value of the second argument for all items in the enumerable. This method is often simpler/faster than using a callback.
       */
      isEvery(key: string, value: string): boolean;
      /**
       * Returns `true` if the passed function returns true for any item in the enumeration. This corresponds with the `some()` method in JavaScript 1.6.
       */
      any(callback: Function, target: {}): boolean;
      /**
       * Returns `true` if the passed property resolves to the value of the second argument for any item in the enumerable. This method is often simpler/faster than using a callback.
       */
      isAny(key: string, value: string): boolean;
      /**
       * This will combine the values of the enumerator into a single value. It is a useful way to collect a summary value from an enumeration. This corresponds to the `reduce()` method defined in JavaScript 1.8.
       */
      reduce(callback: Function, initialValue: {}, reducerProperty: string): {};
      /**
       * Invokes the named method on every object in the receiver that implements it. This method corresponds to the implementation in Prototype 1.6.
       */
      invoke(methodName: string, ...args: any[]): Ember.Array;
      /**
       * Simply converts the enumerable into a genuine array. The order is not guaranteed. Corresponds to the method implemented by Prototype.
       */
      toArray(): Ember.Array;
      /**
       * Returns a copy of the array with all `null` and `undefined` elements removed.
       */
      compact(): Ember.Array;
      /**
       * Returns a new enumerable that excludes the passed value. The default implementation returns an array regardless of the receiver type unless the receiver does not contain the value.
       */
      without(value: {}): Enumerable;
      /**
       * Returns a new enumerable that contains only unique values. The default implementation returns an array regardless of the receiver type.
       */
      uniq(): Enumerable;
      /**
       * Converts the enumerable into an array and sorts by the keys specified in the argument.
       */
      sortBy(property: string): Ember.Array;
      /**
       * Adds each object in the passed enumerable to the receiver.
       */
      addObjects(objects: Enumerable): {};
      /**
       * Removes each object in the passed enumerable from the receiver.
       */
      removeObjects(objects: Enumerable): {};
      /**
       * Retrieves the value of a property from the object.
       */
      get(keyName: string): {};
      /**
       * To get the values of multiple properties at once, call `getProperties` with a list of strings or an array:
       */
      getProperties(...list: string[]): {};
      /**
       * Sets the provided key or path to the value.
       */
      set(keyName: string, value: {}): {};
      /**
       * Sets a list of properties at once. These properties are set inside a single `beginPropertyChanges` and `endPropertyChanges` batch, so observers will be buffered.
       */
      setProperties(hash: {}): {};
      /**
       * Convenience method to call `propertyWillChange` and `propertyDidChange` in succession.
       */
      notifyPropertyChange(keyName: string): Observable;
      /**
       * Adds an observer on a property.
       */
      addObserver(key: string, target: {}, method: string|Function);
      /**
       * Remove an observer you have previously registered on this object. Pass the same key, target, and method you passed to `addObserver()` and your target will no longer receive notifications.
       */
      removeObserver(key: string, target: {}, method: string|Function);
      /**
       * Retrieves the value of a property, or a default value in the case that the property returns `undefined`.
       */
      getWithDefault(keyName: string, defaultValue: {}): {};
      /**
       * Set the value of a property to the current value plus some amount.
       */
      incrementProperty(keyName: string, increment: number): number;
      /**
       * Set the value of a property to the current value minus some amount.
       */
      decrementProperty(keyName: string, decrement: number): number;
      /**
       * Set the value of a boolean property to the opposite of its current value.
       */
      toggleProperty(keyName: string): boolean;
      /**
       * Returns the cached value of a computed property, if it exists. This allows you to inspect the value of a computed property without accidentally invoking it if it is intended to be generated lazily.
       */
      cacheFor(keyName: string): {};
    }
    /**
     * `Ember.Object` is the main base class for all Ember objects. It is a subclass of `Ember.CoreObject` with the `Ember.Observable` mixin applied. For details, see the documentation for each of these.
     */
    export class Object extends CoreObject implements Observable {
      /**
       * Retrieves the value of a property from the object.
       */
      get(keyName: string): {};
      /**
       * To get the values of multiple properties at once, call `getProperties` with a list of strings or an array:
       */
      getProperties(...list: string[]): {};
      /**
       * Sets the provided key or path to the value.
       */
      set(keyName: string, value: {}): {};
      /**
       * Sets a list of properties at once. These properties are set inside a single `beginPropertyChanges` and `endPropertyChanges` batch, so observers will be buffered.
       */
      setProperties(hash: {}): {};
      /**
       * Convenience method to call `propertyWillChange` and `propertyDidChange` in succession.
       */
      notifyPropertyChange(keyName: string): Observable;
      /**
       * Adds an observer on a property.
       */
      addObserver(key: string, target: {}, method: string|Function);
      /**
       * Remove an observer you have previously registered on this object. Pass the same key, target, and method you passed to `addObserver()` and your target will no longer receive notifications.
       */
      removeObserver(key: string, target: {}, method: string|Function);
      /**
       * Retrieves the value of a property, or a default value in the case that the property returns `undefined`.
       */
      getWithDefault(keyName: string, defaultValue: {}): {};
      /**
       * Set the value of a property to the current value plus some amount.
       */
      incrementProperty(keyName: string, increment: number): number;
      /**
       * Set the value of a property to the current value minus some amount.
       */
      decrementProperty(keyName: string, decrement: number): number;
      /**
       * Set the value of a boolean property to the opposite of its current value.
       */
      toggleProperty(keyName: string): boolean;
      /**
       * Returns the cached value of a computed property, if it exists. This allows you to inspect the value of a computed property without accidentally invoking it if it is intended to be generated lazily.
       */
      cacheFor(keyName: string): {};
    }
    /**
     * `Ember.ObjectProxy` forwards all properties not defined by the proxy itself to a proxied `content` object.
     */
    export class ObjectProxy {
    }
    export class Service extends Object {
    }
    export class _Metamorph {
    }
    export class _MetamorphView extends View implements _Metamorph {
    }
    /**
     * An `Ember.Component` is a view that is completely isolated. Properties accessed in its templates go to the view object and actions are targeted at the view object. There is no access to the surrounding context or outer controller; all contextual information must be passed in.
     */
    export class Component extends View implements ViewTargetActionSupport {
      /**
       * Calls a action passed to a component.
       */
      sendAction(action: string, params: any);
      /**
       * Returns true when the component was invoked with a block template.
       */
      hasBlock: any;
      /**
       * Returns true when the component was invoked with a block parameter supplied.
       */
      hasBlockParams: any;
      /**
       * Enables components to take a list of parameters as arguments
       */
      static positionalParams: any;
      /**
       * Renders the view again. This will work regardless of whether the view is already in the DOM or not. If the view is in the DOM, the rendering process will be deferred to give bindings a chance to synchronize.
       */
      rerender();
      /**
       * Returns the current DOM element for the view.
       */
      element: DOMElement;
      /**
       * Returns a jQuery object for this view's element. If you pass in a selector string, this method will return a jQuery object, using the current element as its buffer.
       */
      $(selector: string): JQuery;
      /**
       * The HTML `id` of the view's element in the DOM. You can provide this value yourself but it must be unique (just as in HTML):
       */
      elementId: string;
      /**
       * Tag name for the view's outer element. The tag name is only used when an element is first created. If you change the `tagName` for an element, you must destroy and recreate the view element.
       */
      tagName: string;
      /**
       * Normally, Ember's component model is "write-only". The component takes a bunch of attributes that it got passed in, and uses them to render its template.
       */
      readDOMAttr(name: string): void;
    }
    export class AriaRoleSupport {
      /**
       * The WAI-ARIA role of the control represented by this view. For example, a button may have a role of type 'button', or a pane may have a role of type 'alertdialog'. This property is used by assistive software to help visually challenged users navigate rich web applications.
       */
      ariaRole: string;
    }
    export class ClassNamesSupport {
      /**
       * Standard CSS class names to apply to the view's outer element. This property automatically inherits any class names defined by the view's superclasses as well.
       */
      classNames: Ember.Array;
      /**
       * A list of properties of the view to apply as class names. If the property is a string value, the value of that string will be applied as a class name.
       */
      classNameBindings: Ember.Array;
    }
    export class EmptyViewSupport {
    }
    export class InstrumentationSupport {
      /**
       * Used to identify this view during debugging
       */
      instrumentDisplay: string;
    }
    export class LegacyViewSupport {
    }
    export class TemplateRenderingSupport {
    }
    /**
     * `TextSupport` is a shared mixin used by both `Ember.TextField` and `Ember.TextArea`. `TextSupport` adds a number of methods that allow you to specify a controller action to invoke when a certain event is fired on your text field or textarea. The specifed controller action would get the current value of the field passed in as the only argument unless the value of the field is empty. In that case, the instance of the field itself is passed in as the only argument.
     */
    export class TextSupport extends Mixin implements TargetActionSupport {
    }
    /**
     * `Ember.ViewTargetActionSupport` is a mixin that can be included in a view class to add a `triggerAction` method with semantics similar to the Handlebars `{{action}}` helper. It provides intelligent defaults for the action's target: the view's controller; and the context that is sent with the action: the view's context.
     */
    export class ViewTargetActionSupport extends TargetActionSupport {
      /**
       * Renders the view again. This will work regardless of whether the view is already in the DOM or not. If the view is in the DOM, the rendering process will be deferred to give bindings a chance to synchronize.
       */
      rerender();
      /**
       * Returns the current DOM element for the view.
       */
      element: DOMElement;
      /**
       * Returns a jQuery object for this view's element. If you pass in a selector string, this method will return a jQuery object, using the current element as its buffer.
       */
      $(selector: string): JQuery;
      /**
       * The HTML `id` of the view's element in the DOM. You can provide this value yourself but it must be unique (just as in HTML):
       */
      elementId: string;
      /**
       * Tag name for the view's outer element. The tag name is only used when an element is first created. If you change the `tagName` for an element, you must destroy and recreate the view element.
       */
      tagName: string;
      /**
       * Normally, Ember's component model is "write-only". The component takes a bunch of attributes that it got passed in, and uses them to render its template.
       */
      readDOMAttr(name: string): void;
    }
    export class VisibilitySupport {
      /**
       * If `false`, the view will appear hidden in DOM.
       */
      isVisible: boolean;
    }
    /**
     * `Ember.EventDispatcher` handles delegating browser events to their corresponding `Ember.Views.` For example, when you click on a view, `Ember.EventDispatcher` ensures that that view's `mouseDown` method gets called.
     */
    export class EventDispatcher extends Object {
    }
    /**
     * The internal class used to create text inputs when the `{{input}}` helper is used with `type` of `checkbox`.
     */
    export class Checkbox extends Component {
    }
    /**
     * `Ember.CollectionView` is an `Ember.View` descendent responsible for managing a collection (an array or array-like object) by maintaining a child view object and associated DOM representation for each item in the array and ensuring that child views and their associated rendered HTML are updated when items in the array are added, removed, or replaced.
     */
    export class CollectionView extends ContainerView implements EmptyViewSupport {
    }
    /**
     * DEPRECATED: See http://emberjs.com/deprecations/v1.x/#toc_ember-containerview
     * A `ContainerView` is an `Ember.View` subclass that implements `Ember.MutableArray` allowing programmatic management of its child views.
     */
    export class ContainerView extends View {
    }
    /**
     * DEPRECATED: Use `Ember.View` instead.
     * `Ember.CoreView` is an abstract class that exists to give view-like behavior to both Ember's main view class `Ember.View` and other classes that don't need the fully functionaltiy of `Ember.View`.
     */
    export class CoreView extends Object implements Evented, ActionHandler {
      /**
       * DEPRECATED: Use `Ember.View` instead.
       * Override the default event firing from `Ember.Evented` to also call methods with the given name.
       */
      trigger(name: string);
      /**
       * DEPRECATED: Use `Ember.View` instead.
       * Subscribes to a named event with given function.
       */
      on(name: string, target: {}, method: Function): void;
      /**
       * DEPRECATED: Use `Ember.View` instead.
       * Subscribes a function to a named event and then cancels the subscription after the first time the event is triggered. It is good to use ``one`` when you only care about the first time an event has taken place.
       */
      one(name: string, target: {}, method: Function): void;
      /**
       * DEPRECATED: Use `Ember.View` instead.
       * Cancels subscription for given name, target, and method.
       */
      off(name: string, target: {}, method: Function): void;
      /**
       * DEPRECATED: Use `Ember.View` instead.
       * Checks to see if object has any subscriptions for named event.
       */
      has(name: string): boolean;
      /**
       * DEPRECATED: Use `Ember.View` instead.
       * The collection of functions, keyed by name, available on this `ActionHandler` as action targets.
       */
      actions: {};
      /**
       * DEPRECATED: Use `Ember.View` instead.
       * Triggers a named action on the `ActionHandler`. Any parameters supplied after the `actionName` string will be passed as arguments to the action target function.
       */
      send(actionName: string, context: any);
    }
    /**
     * DEPRECATED: See http://emberjs.com/deprecations/v1.x/#toc_ember-select
     * The `Ember.Select` view class renders a [select](https://developer.mozilla.org/en/HTML/Element/select) HTML element, allowing the user to choose from a list of options.
     */
    export class Select extends View {
      /**
       * DEPRECATED: See http://emberjs.com/deprecations/v1.x/#toc_ember-select
       * The `multiple` attribute of the select element. Indicates whether multiple options can be selected.
       */
      multiple: boolean;
      /**
       * DEPRECATED: See http://emberjs.com/deprecations/v1.x/#toc_ember-select
       * The `disabled` attribute of the select element. Indicates whether the element is disabled from interactions.
       */
      disabled: boolean;
      /**
       * DEPRECATED: See http://emberjs.com/deprecations/v1.x/#toc_ember-select
       * The `required` attribute of the select element. Indicates whether a selected option is required for form validation.
       */
      required: boolean;
      /**
       * DEPRECATED: See http://emberjs.com/deprecations/v1.x/#toc_ember-select
       * The list of options.
       */
      content: Ember.Array;
      /**
       * DEPRECATED: See http://emberjs.com/deprecations/v1.x/#toc_ember-select
       * When `multiple` is `false`, the element of `content` that is currently selected, if any.
       */
      selection: {};
      /**
       * DEPRECATED: See http://emberjs.com/deprecations/v1.x/#toc_ember-select
       * In single selection mode (when `multiple` is `false`), value can be used to get the current selection's value or set the selection by its value.
       */
      value: string;
      /**
       * DEPRECATED: See http://emberjs.com/deprecations/v1.x/#toc_ember-select
       * If given, a top-most dummy option will be rendered to serve as a user prompt.
       */
      prompt: string;
      /**
       * DEPRECATED: See http://emberjs.com/deprecations/v1.x/#toc_ember-select
       * The path of the option labels. See [content](/api/classes/Ember.Select.html#property_content).
       */
      optionLabelPath: string;
      /**
       * DEPRECATED: See http://emberjs.com/deprecations/v1.x/#toc_ember-select
       * The path of the option values. See [content](/api/classes/Ember.Select.html#property_content).
       */
      optionValuePath: string;
      /**
       * DEPRECATED: See http://emberjs.com/deprecations/v1.x/#toc_ember-select
       * The path of the option group. When this property is used, `content` should be sorted by `optionGroupPath`.
       */
      optionGroupPath: string;
      /**
       * DEPRECATED: See http://emberjs.com/deprecations/v1.x/#toc_ember-select
       * The view class for optgroup.
       */
      groupView: View;
    }
    /**
     * The internal class used to create textarea element when the `{{textarea}}` helper is used.
     */
    export class TextArea extends Component implements TextSupport {
    }
    /**
     * The internal class used to create text inputs when the `{{input}}` helper is used with `type` of `text`. See [Ember.Templates.helpers.input](/api/classes/Ember.Templates.helpers.html#method_input)  for usage details. ## Layout and LayoutName properties Because HTML `input` elements are self closing `layout` and `layoutName` properties will not be applied. See [Ember.View](/api/classes/Ember.View.html)'s layout section for more information.
     */
    export class TextField extends Component implements TextSupport {
      /**
       * The `value` attribute of the input element. As the user inputs text, this property is updated live.
       */
      value: string;
      /**
       * The `type` attribute of the input element.
       */
      type: string;
      /**
       * The `size` of the text field in characters.
       */
      size: string;
      /**
       * The `pattern` attribute of input element.
       */
      pattern: string;
      /**
       * The `min` attribute of input element used with `type="number"` or `type="range"`.
       */
      min: string;
      /**
       * The `max` attribute of input element used with `type="number"` or `type="range"`.
       */
      max: string;
    }
    /**
     * DEPRECATED: See http://emberjs.com/deprecations/v1.x/#toc_ember-view
     * `Ember.View` is the class in Ember responsible for encapsulating templates of HTML content, combining templates with data to render as sections of a page's DOM, and registering and responding to user-initiated events.
     */
    export class View extends CoreView implements TemplateRenderingSupport, ClassNamesSupport, LegacyViewSupport, InstrumentationSupport, VisibilitySupport, AriaRoleSupport {
      /**
       * DEPRECATED: See http://emberjs.com/deprecations/v1.x/#toc_ember-view
       * Standard CSS class names to apply to the view's outer element. This property automatically inherits any class names defined by the view's superclasses as well.
       */
      classNames: Ember.Array;
      /**
       * DEPRECATED: See http://emberjs.com/deprecations/v1.x/#toc_ember-view
       * A list of properties of the view to apply as class names. If the property is a string value, the value of that string will be applied as a class name.
       */
      classNameBindings: Ember.Array;
      /**
       * DEPRECATED: See http://emberjs.com/deprecations/v1.x/#toc_ember-view
       * Used to identify this view during debugging
       */
      instrumentDisplay: string;
      /**
       * DEPRECATED: See http://emberjs.com/deprecations/v1.x/#toc_ember-view
       * If `false`, the view will appear hidden in DOM.
       */
      isVisible: boolean;
      /**
       * DEPRECATED: See http://emberjs.com/deprecations/v1.x/#toc_ember-view
       * The WAI-ARIA role of the control represented by this view. For example, a button may have a role of type 'button', or a pane may have a role of type 'alertdialog'. This property is used by assistive software to help visually challenged users navigate rich web applications.
       */
      ariaRole: string;
    }
  }
  /**
   * A container used to instantiate and cache objects.
   */
  export class Container {
  }
  /**
   * A registry used to store factory and option information keyed by type.
   */
  export class Registry {
  }
  export class Backburner {
  }
  /**
   * Helper class that allows you to register your library with Ember.
   */
  export class Libraries {
  }
  /**
   * Objects of this type can implement an interface to respond to requests to get and set. The default implementation handles simple properties.
   */
  export class Descriptor {
  }
  /**
   * The Routing service is used by LinkComponent, and provides facilities for the component/view layer to interact with the router.
   */
  export class RoutingService {
  }
  export interface Function {
    /**
     * The `property` extension of Javascript's Function prototype is available when `Ember.EXTEND_PROTOTYPES` or `Ember.EXTEND_PROTOTYPES.Function` is `true`, which is the default.
     */
    property();
    /**
     * The `observes` extension of Javascript's Function prototype is available when `Ember.EXTEND_PROTOTYPES` or `Ember.EXTEND_PROTOTYPES.Function` is true, which is the default.
     */
    observes();
    /**
     * The `on` extension of Javascript's Function prototype is available when `Ember.EXTEND_PROTOTYPES` or `Ember.EXTEND_PROTOTYPES.Function` is true, which is the default.
     */
    on();
  }
  export interface String {
  }
  /**
   * ContainerProxyMixin is used to provide public access to specific container functionality.
   */
  export class ContainerProxyMixin {
    /**
     * Returns an object that can be used to provide an owner to a manually created instance.
     */
    ownerInjection(): {};
    /**
     * Given a fullName return a corresponding instance.
     */
    lookup(fullName: string, options: {}): any;
  }
  /**
   * RegistryProxyMixin is used to provide public access to specific registry functionality.
   */
  export class RegistryProxyMixin {
    /**
     * Given a fullName return the corresponding factory.
     */
    resolveRegistration(fullName: string): Function;
    /**
     * Registers a factory that can be used for dependency injection (with `inject`) or for service lookup. Each factory is registered with a full name including two parts: `type:name`.
     */
    register(fullName: string, factory: Function, options: {});
    /**
     * Unregister a factory.
     */
    unregister(fullName: string);
    /**
     * Check if a factory is registered.
     */
    hasRegistration(fullName: string): boolean;
    /**
     * Register an option for a particular factory.
     */
    registerOption(fullName: string, optionName: string, options: {});
    /**
     * Return a specific registered option for a particular factory.
     */
    registeredOption(fullName: string, optionName: string): {};
    /**
     * Register options for a particular factory.
     */
    registerOptions(fullName: string, options: {});
    /**
     * Return registered options for a particular factory.
     */
    registeredOptions(fullName: string): {};
    /**
     * Allow registering options for all factories of a type.
     */
    registerOptionsForType(type: string, options: {});
    /**
     * Return the registered options for all factories of a type.
     */
    registeredOptionsForType(type: string): {};
    /**
     * Define a dependency injection onto a specific factory or all factories of a type.
     */
    inject(factoryNameOrType: string, property: string, injectionName: string);
  }
  /**
   * An HTMLBars AST transformation that replaces all instances of
   */
  export class TransformEachInToHash {
  }
  /**
   * An HTMLBars AST transformation that replaces all instances of
   */
  export class TransformInputOnToOnEvent {
  }
  export default Ember
}
