import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import { translationMacro as t } from 'ember-intl';

export default AbstractIndexRoute.extend({
  modelName: 'inc-category',
  newButtonAction: 'newItem',
  newButtonText: t('incident.buttons.newCategory'),
  pageTitle: t('incident.titles.incidentCategories'),

  actions: {
    editItem(category) {
      this.transitionTo('inc-category.edit', category);
    },

    newItem() {
      this.transitionTo('inc-category.edit', 'new');
    }
  }
});
