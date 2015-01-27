import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import ChargeRoute from 'hospitalrun/mixins/charge-route';
export default AbstractEditRoute.extend(ChargeRoute, {
    editTitle: 'Edit Visit',
    modelName: 'visit',
    newTitle: 'New Visit'
});