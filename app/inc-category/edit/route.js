import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import { translationMacro as t } from 'ember-intl';

export default AbstractEditRoute.extend({
  editTitle: t('incident.titles.editIncidentCategory'),
  modelName: 'inc-category',
  newTitle: t('incident.titles.newIncidentCategory'),

  actions: {
    deleteItem(model) {
      this.controller.send('deleteItem', model);
    }
  }
});
