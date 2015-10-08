import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    charges: { serialize: 'ids' },
    details: { serialize: 'ids' },
    imaging: { serialize: 'ids' },
    labs: { serialize: 'ids' },
    lineItems: { serialize: 'ids' },
    locations: { serialize: 'ids' },
    medication: { serialize: 'ids' },
    payments: { serialize: 'ids' },
    pricingOverrides: { serialize: 'ids' },
    procedures: { serialize: 'ids' },
    purchases: { serialize: 'ids' },
    vitals: { serialize: 'ids' }
  }
});
