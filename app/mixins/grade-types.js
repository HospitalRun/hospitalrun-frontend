import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';
export default Ember.Mixin.create({
  Grades: [
    '2 Haur Hezkuntza',
    '3 Haur Hezkuntza',
    '1 Lehen Hezkuntza',
    '2 Lehen Hezkuntza',
    '3 Lehen Hezkuntza',
    '4 Lehen Hezkuntza',
    '5 Lehen Hezkuntza',
    '6 Lehen Hezkuntza',
    '1 Derrigorrezko Bigarren Hezkuntza',
    '2 Derrigorrezko Bigarren Hezkuntza',
    'Presurgical'
  ].map(SelectValues.selectValuesMap)
});