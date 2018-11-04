import { writable } from 'ember-macro-helpers';
import { translationMacro } from 'ember-intl';

export const t = function() {
  return writable(translationMacro(...arguments));
};
