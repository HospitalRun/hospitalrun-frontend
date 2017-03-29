const Ember = window.Ember;
const { Object: EmberObject, computed, guidFor, run } = Ember;
const { oneWay } = computed;


export default EmberObject.extend(Ember.Evented, {
  adapter: oneWay('namespace.adapter').readOnly(),

  application: oneWay('namespace.application').readOnly(),

  uniqueId: computed('application', function() {
    return `${guidFor(this.get('application'))}__${window.location.href}__${Date.now()}`;
  }),

  init() {
    this.get('adapter').onMessageReceived(message => {
      if (this.get('uniqueId') === message.applicationId || !message.applicationId) {
        this.messageReceived(message.type, message);
      }
    });
  },

  messageReceived(name, message) {
    this.wrap(() => {
      this.trigger(name, message);
    });
  },

  send(messageType, options) {
    options.type = messageType;
    options.from = 'inspectedWindow';
    options.applicationId = this.get('uniqueId');
    this.get('adapter').send(options);
  },

  /**
   * Wrap all code triggered from outside of
   * EmberDebug with this method.
   *
   * `wrap` is called by default
   * on all callbacks triggered by `port`,
   * so no need to call it in this case.
   *
   * - Wraps a callback in `Ember.run`.
   * - Catches all errors during production
   * and displays them in a user friendly manner.
   *
   * @method wrap
   * @param {Function} fn
   * @return {Mixed} The return value of the passed function
   */
  wrap(fn) {
    return run(this, function() {
      try {
        return fn();
      } catch (error) {
        this.get('adapter').handleError(error);
      }
    });
  }
});

