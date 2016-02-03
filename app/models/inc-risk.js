import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  harmScore: DS.attr('string'),
  preIncidentRiskAssesment: DS.belongsTo('inc-risk-assesment', {
    async: false
  }),
  postIncidentRiskAssesment: DS.belongsTo('inc-risk-assesment', {
    async: false
  })
});
