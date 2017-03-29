import computedPolyfill from '../addons/ember-new-computed/index';
const Ember = window.Ember;
const { typeOf, Object: EmberObject, computed, A } = Ember;

const dateComputed = function() {
  return computedPolyfill({
    get() {
      return null;
    },
    set(key, date) {
      if (typeOf(date) === 'date') {
        return date;
      } else if (typeof date === 'number' || typeof date === 'string') {
        return new Date(date);
      }
      return null;
    }
  });
};

export default EmberObject.extend({
  createdAt: dateComputed(),
  settledAt: dateComputed(),
  chainedAt: dateComputed(),

  parent: null,

  children: computed(function() {
    return A();
  }),

  level: computed('parent.level', function() {
    const parent = this.get('parent');
    if (!parent) {
      return 0;
    }
    return parent.get('level') + 1;
  }),

  isSettled: computed('state', function() {
    return this.get('isFulfilled') || this.get('isRejected');
  }),

  isFulfilled: computed('state', function() {
    return this.get('state') === 'fulfilled';
  }),

  isRejected: computed('state', function() {
    return this.get('state') === 'rejected';
  })

});
