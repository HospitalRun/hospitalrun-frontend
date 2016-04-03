import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import { translationMacro as t } from 'ember-i18n';

export default AbstractIndexRoute.extend({
  editReturn: 'appointments.missed',
  modelName: 'appointment',
  pageTitle: t('appointments.missed')
});