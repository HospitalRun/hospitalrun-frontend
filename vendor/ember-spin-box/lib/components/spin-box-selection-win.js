(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(['ember'], function(Ember) { return factory(Ember); });
    } else if(typeof exports === 'object') {
        module.exports = factory(require('ember'));
    } else {
        root.SpinBoxSelectionWinComponent = factory(Ember);
    }
})(this, function(Ember) {
    
    var SpinBoxSelectionWinComponent = Ember.Component.extend({
        classNames: ['spinbox-selection-window'],

        setup: function() {
            this.positionEl();
        }.on('didInsertElement'),

        positionEl: function() {
            var rowH = this.get('parentView.rowHeight');
            this.$().css('margin-top', '-' + (rowH / 2) + 'px');
        }.observes('parentView.rowHeight')
    });

    return SpinBoxSelectionWinComponent;
});