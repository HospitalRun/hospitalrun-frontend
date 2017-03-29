import Ember from "ember";

const { Controller, computed, computed: { equal } } = Ember;

export default Controller.extend({
  isDragging: false,
  contentHeight: null,
  emberApplication: false,
  navWidth: 180,
  inspectorWidth: 360,
  mixinStack: computed(() => []),
  mixinDetails: computed(() => []),
  isChrome: equal('port.adapter.name', 'chrome'),

  deprecationCount: 0,

  // Indicates that the extension window is focused,
  active: true,

  inspectorExpanded: false,

  pushMixinDetails(name, property, objectId, details, errors) {
    details = {
      name,
      property,
      objectId,
      mixins: details,
      errors
    };

    this.get('mixinStack').pushObject(details);
    this.set('mixinDetails', details);
  },

  popMixinDetails() {
    let mixinStack = this.get('mixinStack');
    let item = mixinStack.popObject();
    this.set('mixinDetails', mixinStack.get('lastObject'));
    this.get('port').send('objectInspector:releaseObject', { objectId: item.objectId });
  },

  activateMixinDetails(name, objectId, details, errors) {
    this.get('mixinStack').forEach(item => {
      this.get('port').send('objectInspector:releaseObject', { objectId: item.objectId });
    });

    this.set('mixinStack', []);
    this.pushMixinDetails(name, undefined, objectId, details, errors);
  },

  droppedObject(objectId) {
    let mixinStack = this.get('mixinStack');
    let obj = mixinStack.findBy('objectId', objectId);
    if (obj) {
      let index = mixinStack.indexOf(obj);
      let objectsToRemove = [];
      for (let i = index; i >= 0; i--) {
        objectsToRemove.pushObject(mixinStack.objectAt(i));
      }
      objectsToRemove.forEach(item => {
        mixinStack.removeObject(item);
      });
    }
    if (mixinStack.get('length') > 0) {
      this.set('mixinDetails', mixinStack.get('lastObject'));
    } else {
      this.set('mixinDetails', null);
    }

  }
});
