import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  typeOfPerson: DS.attr('string'),
  identityDocumentType: DS.attr('string'),
  identityNumber: DS.attr('number'),
  narrativeStatement: DS.attr('string'),
  dateRecorded: DS.attr('date')
});
