import { helper } from '@ember/component/helper';
import EmberObject from '@ember/object';
import NumberFormat from 'hospitalrun/mixins/number-format';

let NumberHandler = EmberObject.extend(NumberFormat);
export default helper(function([number]) {
  let numberHandler = new NumberHandler();
  return numberHandler._numberFormat(number);
});
