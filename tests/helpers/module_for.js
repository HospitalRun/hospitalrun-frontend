var __testing_context__;

import resolver from 'hospitalrun/tests/helpers/resolver';

function defaultSubject(factory, options) {
  return factory.create(options);
}

export function moduleFor(fullName, description, callbacks, delegate) {
  callbacks = callbacks || { };

  var needs = [fullName].concat(callbacks.needs || []);
  var container = isolatedContainer(needs);

  callbacks.subject = callbacks.subject || defaultSubject;

  callbacks.setup    = callbacks.setup    || function() { };
  callbacks.teardown = callbacks.teardown || function() { };

  function factory() {
    return container.lookupFactory(fullName);
  }

  function subject(options) {
    return callbacks.subject(factory(), options);
  }

  __testing_context__ = {
    container: container,
    subject: subject,
    factory: factory,
    __setup_properties__: callbacks
  };

  if (delegate) {
    delegate(container, __testing_context__);
  }

  var context = __testing_context__;
  var _callbacks = {
    setup: function(){
      buildContextVariables(context);
      callbacks.setup.call(context, container);
    },
    teardown: function(){
      Ember.run(function(){
        container.destroy();
        // destroy all cached variables
      });

      Ember.$('#ember-testing').empty();
      // maybe destroy all the add-hoc objects

      callbacks.teardown(container);
    }
  };

  module(description || fullName, _callbacks);
}

// allow arbitrary named factories, like rspec let
function buildContextVariables(context) {
  var cache = { };
  var callbacks = context.__setup_properties__;
  var factory = context.factory;
  var container = context.container;

  Ember.keys(callbacks).filter(function(key){
    // ignore the default setup/teardown keys
    return key !== 'setup' && key !== 'teardown';
  }).forEach(function(key){
    context[key] = function(options) {
      if (cache[key]) {
        return cache[key];
      }

      var result = callbacks[key](factory(), options, container);
      cache[key] = result;
      return result;
    };
  });
}

export function test(testName, callback) {
  var context = __testing_context__; // save refence

  function wrapper() {
    var result = callback.call(context);

    function failTestOnPromiseRejection(reason) {
      ok(false, reason);
    }

    Ember.run(function(){
      stop();
      Ember.RSVP.Promise.cast(result)['catch'](failTestOnPromiseRejection)['finally'](start);
    });
  }

  QUnit.test(testName, wrapper);
}

export function moduleForModel(name, description, callbacks) {
  moduleFor('model:' + name, description, callbacks, function(container, context) {
    // custom model specific awesomeness
    container.register('store:main', DS.Store);
    container.register('adapter:application', DS.FixtureAdapter);

    context.__setup_properties__.store = function(){
      return container.lookup('store:main');
    };

    if (context.__setup_properties__.subject === defaultSubject) {
      context.__setup_properties__.subject = function(options) {
        return Ember.run(function() {
          return container.lookup('store:main').createRecord(name, options);
        });
      };
    }
  });
}

export function moduleForComponent(name, description, callbacks) {
  moduleFor('component:' + name, description, callbacks, function(container, context) {
    var templateName = 'template:components/' + name;

    var template = resolver.resolve(templateName);

    if (template) {
      container.register(templateName, template);
      container.injection('component:' + name, 'template', templateName);
    }

    context.__setup_properties__.$ = function(selector) {
      var view = Ember.run(function(){
        return context.subject().appendTo(Ember.$('#ember-testing')[0]);
      });

      return view.$();
    };
  });
}

