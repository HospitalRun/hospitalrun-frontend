<<<<<<< HEAD
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

export default Ember.Mixin.create({
  validations: {
    result: {
      acceptance: {
        accept: true,
        if(object) {
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
=======
import { isEmpty } from '@ember/utils';
import Mixin from '@ember/object/mixin';
import { translationMacro as t } from 'ember-i18n';

export default Mixin.create({
  validations: {
    result: {
      acceptance: {
        accept: true,
        if(object) {
          if (!object.get('hasDirtyAttributes')) {
            return false;
          }
          let status = object.get('status');
          let result = object.get('result');
          if (status === 'Completed' && isEmpty(result)) {
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
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
