import Ember from 'ember';
const { Helper: { helper } } = Ember;

export function msToTime([time]) {
  if (time && !isNaN(+time)) {
    let formatted = time.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return `${formatted}ms`;
  }
}

export default helper(msToTime);
