import AbstractItemRoute from 'hospitalrun/routes/abstract-item-route';
import MedicationMapping from 'hospitalrun/mixins/medication-mapping';
export default AbstractItemRoute.extend(MedicationMapping, {
    modelName: 'medication',
    moduleName: 'medication',
    model: function() {
        return this.store.find('medication', {
            mapResults: this._mapViewResults,
            fieldMapping: this.fieldMapping
        });
    }
});

