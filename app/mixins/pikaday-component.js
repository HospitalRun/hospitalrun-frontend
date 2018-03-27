import Ember from 'ember';

const { get, isEmpty, set } = Ember;

export default Ember.Mixin.create({
  _picker: null,
  currentDate: null,
  dateSetAction: null, // Specify an action to fire when a date is selected
  format: 'l',
  maxDate: null,
  minDate: null,
  originalProperty: null,
  showTime: false,
  yearRange: 10,

  // Override with logic to fire when date is set
  dateSet() {
    let picker = get(this, '_picker');
    let newDate = picker.getDate();
    let dateSetAction = get(this, 'dateSetAction');
    set(this, 'currentDate', newDate);
    if (!isEmpty(dateSetAction)) {
      this.sendAction('dateSetAction', newDate);
    }
  },

  didInsertElement() {
    let currentDate = get(this, 'currentDate');
    let $input = this.$('input');
    $input.on('input', () => {
      if (isEmpty($input.val())) {
        set(this, 'currentDate', null);
      }
    });
    let picker = null;
    let props = this.getProperties('format', 'yearRange', 'showTime');

    props.onSelect = this.dateSet.bind(this);

    if (!isEmpty(get(this, 'minDate'))) {
      props.minDate = get(this, 'minDate');
      if (props.minDate === 'now') {
        props.minDate = new Date();
      }
    }
    if (!isEmpty(get(this, 'maxDate'))) {
      props.maxDate = get(this, 'maxDate');
      if (props.maxDate === 'now') {
        props.maxDate = new Date();
      }
    }
    props.field = $input[0];
    picker = new Pikaday(props);
    Ember.run.next(this, function() {
      picker.setDate(currentDate);
    });
    set(this, '_picker', picker);
  },

  willDestroyElement() {
    let picker = get(this, '_picker');
    if (picker) {
      picker.destroy();
    }
    set(this, '_picker', null);
  }

});
