// HARM Score criteria from here: https://fshrmps.org/docs/resources/theReliabilityofAHRQ_CommonFormatHarmScales_inRatingPSE.pdf
import Ember from 'ember';
export default Ember.Mixin.create({
  harmScoreList: [{
    label: 'Death: Death at time of assessment',
    value: 'Death'
  }, {
    label: 'Severe Harm: Bodily or psychological injury (including pain and disfigurement) that interferes significantly with functional ability or quality of life',
    value: 'Severe Harm'
  }, {
    label: 'Moderate Harm: Bodily or psychological injury adversely affecting functional ability or quality of life, but not at the level of severe harm',
    value: 'Moderate Harm'
  }, {
    label: 'Mild Harm: Minimal symptoms, loss of function, or injury limited to additional treatment, monitoring, and/or increased length of stay',
    value: 'Mild Harm'
  }, {
    label: 'No Harm: Event reached patient, but no harm was evident',
    value: 'No Harm'
  }, {
    label: 'Unknown: The severity is unknown at the time of assessment',
    value: 'Unknown'
  }],
  harmDurationList: [{
    label: 'Permanent Harm: Greater than or equal to 1 year',
    value: 'Permanent Duration'
  }, {
    label: 'Temporary Harm: Less than 1 year',
    value: 'Temporary Duration'
  }, {
    label: 'Unknown: The duration is unknown at the time of assessment',
    value: 'Unknown'
  }]
});