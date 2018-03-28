import { htmlSafe } from '@ember/string';
import { helper } from '@ember/component/helper';
export default helper(function([text]) {
  if (text !== null && typeof text !== 'undefined') {
    return htmlSafe(text.replace(/\n/g, '<br>'));
  } else {
    return null;
  }
});
