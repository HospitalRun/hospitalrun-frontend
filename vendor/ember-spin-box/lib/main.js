(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define([
            'ember',
            './components/spin-box-row.js',
            './components/spin-box-selection-win.js',
            './components/spin-box.js',
            './views/spin-box-rows.js'
        ], function(Ember, Row, SelectionWin, SpinBox, Rows) { 
            return factory(Ember, Row, SelectionWin, SpinBox, Rows); 
        });
    } else if(typeof exports === 'object') {
        module.exports = factory(
            require('ember'),
            require('./components/spin-box-row.js'),
            require('./components/spin-box-selection-win.js'),
            require('./components/spin-box.js'),
            require('./views/spin-box-rows.js')
        );
    } else {
        factory(
            Ember,
            root.SpinBoxRowComponent,
            root.SpinBoxSelectionWinComponent,
            root.SpinBoxComponent,
            root.SpinBoxRowsView
        );
    }
})(this, function(Ember, Row, SelectionWin, SpinBox, Rows) {

    Ember.Application.initializer({
        name: 'spin-box',
        initialize: function(container, application) {
            container.register('component:spin-box-row', Row);
            container.register('component:spin-box-selection-win', SelectionWin);
            container.register('component:spin-box', SpinBox);
            container.register('view:spin-box-rows', Rows);
        }
    });

    return {
        SpinBoxRowComponent: Row,
        SpinBoxSelectionWinComponent: SelectionWin,
        SpinBoxComponent: SpinBox,
        Rows: SpinBoxRowsView
    };
});