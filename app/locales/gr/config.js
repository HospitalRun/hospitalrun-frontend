// Ember-I18n includes configuration for common locales. Most users
// can safely delete this file. Use it if you need to override behavior
// for a locale or define behavior for a locale that Ember-I18n
// doesn't know about.
export default {
  rtl: false,

  pluralForm: {
    function(count) {
      if (count === 0) {
        return 'μηδέν';
      }
      if (count === 1) {
        return 'ένα';
      }
      if (count === 2) {
        return 'δύο';
      }
      if (count < 5) {
        return 'τόσα λίγα';
      }
      if (count >= 5) {
        return 'τόσα πολλά';
      }
      return 'άλλο';
    }
  }
};