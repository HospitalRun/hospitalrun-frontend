// ember-intl includes configuration for common locales. Most users
// can safely delete this file. Use it if you need to override behavior
// for a locale or define behavior for a locale that ember-intl
// doesn't know about.
export default {
  rtl: true,

  pluralForm: {
    function(count) {
      if (count === 0) {
        return 'אפס';
      }
      if (count === 1) {
        return 'אחד';
      }
      if (count === 2) {
        return 'שניים';
      }
      if (count < 5) {
        return 'מעט';
      }
      if (count >= 5) {
        return 'הרבה';
      }
      return 'אחר';
    }
  }
};