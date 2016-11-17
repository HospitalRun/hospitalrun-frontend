import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';

const {
  computed,
  isEmpty
} = Ember;

export default Ember.Component.extend(SelectValues, {
  classNames: 'detail-section-content',
  propertyPrefix: '',
  fieldsByRow: computed('form', 'form.fields.[]', 'form.columns', function() {
    let rows = [];
    let form = this.get('form');
    let fields = this.get('form.fields');
    if (!isEmpty(form) && !isEmpty(fields)) {
      let numberOfColumns = this.getWithDefault('form.columns', 1);
      let currentRow = [];

      let colCount = 0;
      let colWidth = Math.floor(12 / numberOfColumns);
      fields.forEach((field) => {
        let classNames = field.get('classNames');
        if (!classNames) {
          classNames = '';
        }
        let colSpan = field.get('colSpan') || 1;
        if (colCount === numberOfColumns || (colCount + colSpan) > numberOfColumns) {
          rows.push(currentRow.slice());
          currentRow = [];
          colCount = 0;
        }
        classNames += ` col-sm-${colWidth * colSpan}`;
        field.set('displayClassNames', classNames);
        if (field.get('type') === 'radio') {
          field.set('mappedValues', field.get('values').map((value) => Ember.get(value, 'label')));
        }
        currentRow.push(field);
        colCount += colSpan;
      });
      if (colCount > 0) {
        rows.push(currentRow);
      }
    }
    return rows;
  })
});
