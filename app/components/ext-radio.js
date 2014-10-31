export default Ember.Component.extend({     
    includeOtherOption: false,
    otherOptionLabel: null,
    name: 'radio',
    showInline: false,
    radioLabelPath: 'content.label',
    radioValuePath: 'content.value'
});