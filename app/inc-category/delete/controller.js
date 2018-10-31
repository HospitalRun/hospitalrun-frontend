import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import { translationMacro as t } from 'ember-intl';

export default AbstractDeleteController.extend({
  title: t('incident.titles.deleteIncidentCategory')
});
