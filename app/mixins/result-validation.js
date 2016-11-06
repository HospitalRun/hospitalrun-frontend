import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

export default Ember.Mixin.create({
  validations: {
    result: {
      acceptance: {
        accept: true,
        if: function(object) {
          if (!object.get('hasDirtyAttributes')) {
            return false;
          }
          let status = object.get('status');
          let result = object.get('result');
          if (status === 'Completed' && Ember.isEmpty(result)) {
            // force validation to fail
            return true;
          }
          return false;
        },
        message: t('errors.result')
      }
    }
  }
});
