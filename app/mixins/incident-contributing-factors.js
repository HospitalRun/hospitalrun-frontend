import Ember from 'ember';
export default Ember.Mixin.create({
  contributingFactorList: [{
    label: 'Patient Factor: E.g. Clinical Condition, Physical factors, Social factors, Psychological/Mental factors',
    value: 'Patient Factor'
  }, {
    label: 'Individual / Staff Factor:  E.g. Physical issues, Psychological, Social, Domestic, Personality, Cognitive',
    value: 'Individual Factor'
  }, {
    label: 'Task Factor:    E.g. Guidelines/ Procedures/ Protocols/ Task design',
    value: 'Task Factor'
  }, {
    label: 'Communication Factor:   E.g. Verbal, Written, Non-verbal, Handoff',
    value: 'Communication Factor'
  }, {
    label: 'Team Factor:    E.g. Collaboration, Coordination, Leadership, Support',
    value: 'Team Factor'
  }, {
    label: 'Working Condition factor:   E.g. Environment, Staffing, Workload, Working Hours',
    value: 'Working Condition factor'
  }, {
    label: 'Organizational Factor:  E.g. Organizational structure, Policies, Priorities, Safety culture',
    value: 'Organizational Factor'
  }],

  selectedFactorsList: []
});
