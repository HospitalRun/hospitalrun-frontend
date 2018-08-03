// Ember-I18n includes configuration for common locales. Most users
// can safely delete this file. Use it if you need to override behavior
// for a locale or define behavior for a locale that Ember-I18n
// doesn't know about.
export default {
  rtl: true,

  pluralForm: {
    function(count) {
      if (count === 0) {
        return 'صفر';
      }
      if (count === 1) {
        return 'ایک';
      }
      if (count === 2) {
        return 'دو';
      }
      if (count < 5) {
        return 'کچھ';
      }
      if (count >= 5) {
        return 'بہت سے';
      }
      return 'دوسرا';
    }
  }
};