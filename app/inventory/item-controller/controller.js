export default Ember.ObjectController.extend({
    
    needs: ['inventory'],
    
    isDecreasing: false,    
    showAdd: true,
    showEdit: true,
    showDecrease:true,

    actions: {
        cancelUpdate: function() {
            var inventory = this.get('model');
            inventory.rollback();
            this.resetButtons();
        },

        decreaseInventory: function() {
            if (this.get('isDecreasing')) {
                var quantity = this.get('quantity');
                var decreaseBy = parseInt(this.get('decreaseAmount'));
                if (quantity >= decreaseBy) {
                    quantity = quantity - decreaseBy;
                    this.set('quantity', quantity);
                    this.saveModel();
                }
            } else {
                this.set('isDecreasing', true);
                this.set('showAdd', false);
                this.set('showEdit', false);
            }
        },

        updateInventory: function() {
            this.saveModel();
        }
    }, 

    resetButtons: function() {
        this.set('isDecreasing', false);
        this.set('showAdd', true);
        this.set('showDecrease', true);
        this.set('showEdit', true);
    },
    
    saveModel: function() {
        var controller = this;
        this.get('model').save().then(function() {
            controller.resetButtons();
        }, function(err) {
            console.log("ERROR SAVING INVENTORY:",err);
            throw err;
        });
    }
});