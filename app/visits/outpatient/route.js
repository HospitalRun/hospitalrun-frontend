import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import Ember from 'ember';

export default AbstractIndexRoute.extend({
  pageTitle: 'Outpatient',

  modelName: 'visit',
});
