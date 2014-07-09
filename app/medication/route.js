import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import MedicationMapping from 'hospitalrun/mixins/medication-mapping';
export default AbstractModuleRoute.extend(MedicationMapping, {
    modelName: 'medication',
    moduleName: 'medication',
    newButtonText: '+ new request',
    sectionTitle: 'Medication',

    model: function() {
        return this.store.find('medication', {
            mapResults: this._mapViewResults,
            fieldMapping: this.fieldMapping
        });
    }
});

