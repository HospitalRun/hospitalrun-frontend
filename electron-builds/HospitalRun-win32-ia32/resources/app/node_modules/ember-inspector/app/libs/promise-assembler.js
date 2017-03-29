import Ember from "ember";
import Promise from "ember-inspector/models/promise";

let EventedMixin = Ember.Evented;

let arrayComputed = Ember.computed(function() {
  return [];
});

let objectComputed = Ember.computed(function() {
  return {};
});

export default Ember.Object.extend(EventedMixin, {
  all: arrayComputed,
  topSort: arrayComputed,
  topSortMeta: objectComputed,
  promiseIndex: objectComputed,

  // Used to track whether current message received
  // is the first in the request
  // Mainly helps in triggering 'firstMessageReceived' event
  firstMessageReceived: false,

  start() {
    this.get('port').on('promise:promisesUpdated', this, this.addOrUpdatePromises);
    this.get('port').send('promise:getAndObservePromises');
  },

  stop() {
    this.get('port').off('promise:promisesUpdated', this, this.addOrUpdatePromises);
    this.get('port').send('promise:releasePromises');
    this.reset();
  },

  reset() {
    this.set('topSortMeta', {});
    this.set('promiseIndex', {});
    this.get('topSort').clear();

    this.set('firstMessageReceived', false);
    let all = this.get('all');
    // Lazily destroy promises
    // Allows for a smooth transition on deactivate,
    // and thus providing the illusion of better perf
    Ember.run.later(this, function() {
      this.destroyPromises(all);
    }, 500);
    this.set('all', []);
  },

  destroyPromises(promises) {
    promises.forEach(function(item) {
      item.destroy();
    });
  },

  addOrUpdatePromises(message) {
    this.rebuildPromises(message.promises);

    if (!this.get('firstMessageReceived')) {
      this.set('firstMessageReceived', true);
      this.trigger('firstMessageReceived');
    }
  },

  rebuildPromises(promises) {
    promises.forEach(props => {
      props = Ember.copy(props);
      let childrenIds = props.children;
      let parentId = props.parent;
      delete props.children;
      delete props.parent;
      if (parentId && parentId !== props.guid) {
        props.parent = this.updateOrCreate({ guid: parentId });
      }
      let promise = this.updateOrCreate(props);
      if (childrenIds) {
        childrenIds.forEach(childId => {
          // avoid infinite recursion
          if (childId === props.guid) {
            return;
          }
          let child = this.updateOrCreate({ guid: childId, parent: promise });
          promise.get('children').pushObject(child);
        });
      }
    });
  },

  updateTopSort(promise) {
    let topSortMeta = this.get('topSortMeta');
    let guid = promise.get('guid');
    let meta = topSortMeta[guid];
    let isNew = !meta;
    let hadParent = false;
    let hasParent = !!promise.get('parent');
    let topSort = this.get('topSort');
    let parentChanged = isNew;

    if (isNew) {
      meta = topSortMeta[guid] = {};
    } else {
      hadParent = meta.hasParent;
    }
    if (!isNew && hasParent !== hadParent) {
      // todo: implement recursion to reposition children
      topSort.removeObject(promise);
      parentChanged = true;
    }
    meta.hasParent = hasParent;
    if (parentChanged) {
      this.insertInTopSort(promise);
    }
  },

  insertInTopSort(promise) {
    let topSort = this.get('topSort');
    if (promise.get('parent')) {
      let parentIndex = topSort.indexOf(promise.get('parent'));
      topSort.insertAt(parentIndex + 1, promise);
    } else {
      topSort.pushObject(promise);
    }
    promise.get('children').forEach(child => {
      topSort.removeObject(child);
      this.insertInTopSort(child);
    });
  },

  updateOrCreate(props) {
    let guid = props.guid;
    let promise = this.findOrCreate(guid);

    promise.setProperties(props);

    this.updateTopSort(promise);

    return promise;
  },

  createPromise(props) {
    let promise = Promise.create(props);
    let index = this.get('all.length');

    this.get('all').pushObject(promise);
    this.get('promiseIndex')[promise.get('guid')] = index;
    return promise;
  },

  find(guid) {
    if (guid) {
      let index = this.get('promiseIndex')[guid];
      if (index !== undefined) {
        return this.get('all').objectAt(index);
      }
    } else {
      return this.get('all');
    }
  },

  findOrCreate(guid) {
    if (!guid) {
      Ember.assert('You have tried to findOrCreate without a guid');
    }
    return this.find(guid) || this.createPromise({ guid });
  }
});
