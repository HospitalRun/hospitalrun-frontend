  import Ember from 'ember';
export default Ember.Mixin.create({
  preSeverityTypes: [{
    label: '5 - Extreme: death, toxic release off-site with detrimental effect, huge financial loss, etc.',
    value: 5
  }, {
    label: '4 - High: extensive injuries, loss of production capability, off-site release with no detrimental effects, major financial loss, etc.',
    value: 4
  }, {
    label: '3 - Moderate: medical treatment required, on-site release contained with outside assistance, high financial loss, etc.',
    value: 3
  }, {
    label: '2 - Low: first aid treatment, on-site release contained, medium financial loss, etc.',
    value: 2
  }, {
    label: '1 - Minimum: no injuries, low financial loss, etc.',
    value: 1
  }, {
    label: '0 - None: no injuries, no financial losses, etc.',
    value: 0
  }],

  preOccurrenceTypes: [{
    label: '5 - Certain: expected to occur in most circumstances (e.g. most weeks or months)',
    value: 5
  }, {
    label: '4 - Likely: might occur in most circumstances (several times a year)',
    value: 4
  }, {
    label: '3 - Possible: might occur at some time (every 1 to 2 years)',
    value: 3
  }, {
    label: '2 - Unlikely: could occur at some time (within the next 2 to 5 years)',
    value: 2
  }, {
    label: '1 - Rare: may occur only in exceptional circumstances (once every 5 to 30 years)',
    value: 1
  }, {
    label: '0 - Never: will never occur again',
    value: 0
  }],

  preRiskScores: [{
    label: '15-25  : extreme risk; immediate action required',
    value: '(Pre Risk) Extreme risk; immediate action required'
  }, {
    label: '9-12   : high risk; senior management needed',
    value: '(Pre Risk) High risk; senior management needed'
  }, {
    label: '4-8    : moderate risk; management responsibility must be specified',
    value: '(Pre Risk) Moderate risk; management responsibility must be specified'
  }, {
    label: '1-3    : low risk; manage by routine procedures',
    value: '(Pre Risk) Low risk; manage by routine procedures'
  }]
});