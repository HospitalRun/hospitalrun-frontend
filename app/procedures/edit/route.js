import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import ChargeRoute from 'hospitalrun/mixins/charge-route';
export default AbstractEditRoute.extend(ChargeRoute, {
    editTitle: 'Edit Procedure', 
    modelName: 'procedure',
    newTitle: 'New Procedure'
});