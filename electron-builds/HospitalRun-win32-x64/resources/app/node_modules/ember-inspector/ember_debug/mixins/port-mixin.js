const Ember = window.Ember;
const { Mixin } = Ember;
export default Mixin.create({
  port: null,
  messages: {},

  portNamespace: null,

  init() {
    this.setupPortListeners();
  },

  willDestroy() {
    this.removePortListeners();
  },

  sendMessage(name, message) {
    this.get('port').send(this.messageName(name), message);
  },

  setupPortListeners() {
    let port = this.get('port');
    let messages = this.get('messages');

    for (let name in messages) {
      if (messages.hasOwnProperty(name)) {
        port.on(this.messageName(name), this, messages[name]);
      }
    }
  },

  removePortListeners() {
    let port = this.get('port');
    let messages = this.get('messages');

    for (let name in messages) {
      if (messages.hasOwnProperty(name)) {
        port.off(this.messageName(name), this, messages[name]);
      }
    }
  },

  messageName(name) {
    let messageName = name;
    if (this.get('portNamespace')) {
      messageName = `${this.get('portNamespace')}:${messageName}`;
    }
    return messageName;
  }
});
