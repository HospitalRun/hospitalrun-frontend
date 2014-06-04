export default Ember.View.extend({
    layoutName: 'modal',
    
    didInsertElement: function() {
        var $modal = this.$('.modal').modal();

        $modal.on('hidden.bs.modal', function () {
            this.get('controller').send('closeModal');
        }.bind(this));
    },

    willDestroyElement: function() {
        this.$('.modal').modal('hide');
        //jquery fix
        $('.modal-backdrop').remove();
    }
});