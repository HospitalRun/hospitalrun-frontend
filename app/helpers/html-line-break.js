<<<<<<< HEAD
import Ember from 'ember';
export default Ember.Helper.helper(function([text]) {
  if (text !== null && typeof text !== 'undefined') {
    return Ember.String.htmlSafe(text.replace(/\n/g, '<br>'));
  } else {
    return null;
  }
});
=======
import { htmlSafe } from '@ember/string';
import { helper } from '@ember/component/helper';
export default helper(function([text]) {
  if (text !== null && typeof text !== 'undefined') {
    return htmlSafe(text.replace(/\n/g, '<br>'));
  } else {
    return null;
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
