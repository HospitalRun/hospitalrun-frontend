const Ember = window.Ember;
const { computed } = Ember;
let supportsSetterGetter;

try {
  computed({
    set() { },
    get() { }
  });
  supportsSetterGetter = true;
} catch (e) {
  supportsSetterGetter = false;
}

export default supportsSetterGetter;
