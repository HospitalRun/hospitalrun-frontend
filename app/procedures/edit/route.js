import { resolve } from 'rsvp';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import AddToPatientRoute from 'hospitalrun/mixins/add-to-patient-route';
import ChargeRoute from 'hospitalrun/mixins/charge-route';
import { t } from 'hospitalrun/macro';

export default AbstractEditRoute.extend(AddToPatientRoute, ChargeRoute, {
  editTitle: t('procedures.titles.edit'),
  modelName: 'procedure',
  newTitle: t('procedures.titles.new'),
  pricingCategory: 'Procedure',
  database: service(),
  photos: null,

  getNewData() {
    return resolve({
      procedureDate: new Date()
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    let medicationQuery = {
      key: 'Medication',
      include_docs: true
    };
    this.get('database').queryMainDB(medicationQuery, 'inventory_by_type').then(function(result) {
      let medicationList = result.rows.map(function(medication) {
        return medication.doc;
      });
      controller.set('medicationList', medicationList);
    });
    this.store.query('photo', {
      options: {
        key: get(model, 'id')
      },
      mapReduce: 'photo_by_procedure'
    }).then(function(photos) {
      let procedurePhotos = [];
      procedurePhotos.addObjects(photos);
      model.set('photos', procedurePhotos);
    });
  },

  actions: {
    deletePhoto(model) {
      this.controller.send('deletePhoto', model);
    }
  }
});
