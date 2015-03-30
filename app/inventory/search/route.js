import AbstractSearchRoute from 'hospitalrun/routes/abstract-search-route';
import InventorySearch from 'hospitalrun/utils/inventory-search';
export default AbstractSearchRoute.extend({
    moduleName: 'inventory',
    searchKeys: [        
        'description',
        'friendlyId',
        'name'
    ],
    searchIndex: InventorySearch,
    searchModel: 'inventory'
});
