(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(['ember'], function(Ember) { return factory(Ember); });
    } else if(typeof exports === 'object') {
        module.exports = factory(require('ember'));
    } else {
        root.SpinBoxRowsView = factory(Ember);
    }
})(this, function(Ember) {

    var SpinBoxRowsView = Ember.ContainerView.extend({
        classNames: ['spinbox-rows'],

        setup: function() {
            this.$el = this.$();
            this.get('parentView').registerRowsView(this);
        }.on('didInsertElement'),

        adjustYOffset: function(offset) {
            this.set('yOffset', this.get('yOffset') + offset);
        },

        positionEl: function() {
            var yOffset = (this.get('parentView._bufferSize')) * this.get('parentView.rowHeight') * -1;
            this.set('yOffset', yOffset);
            Ember.run.next(this, this.enableTransitions);
        }.observes('parentView.rowHeight', 'parentView.visibleRows', 'parentView._bufferSize'),

        enableTransitions: function(duration, timingFn) {
            var cssVal;
            duration = duration || this.get('parentView._defaultTransDuration');
            timingFn = timingFn || this.get('parentView._defaultTransTiming');

            if(!this.get('_transEnabled') || duration !== this.get('parentView._transDuration') || timingFn !== this.get('parentView._transTiming')) {
                cssVal = 'transform ' + (duration / 1000) + 's ' + timingFn;

                this.$el.css({
                    '-webkit-transition': '-webkit-' + cssVal,
                    '-moz-transition': '-moz-' + cssVal,
                    '-ms-transition': '-ms-' + cssVal,
                    '-o-transition': '-o-' + cssVal,
                    'transition': cssVal
                });

                this.set('_transEnabled', true);

                this.get('parentView').setProperties({
                    _transDuration: duration,
                    _transTiming: timingFn
                });
            }
        },

        disableTransitions: function() {
            this.set('_transEnabled', false);
            this.$el.css({
                '-webkit-transition': '',
                '-moz-transition': '',
                '-ms-transition': '',
                '-o-transition': '',
                'transition': ''
            });
        },

        handleOffsetChange: function() {
            var cssVal = 'translateY(' + this.get('yOffset') + 'px)';
            this.$el.css({
                '-webkit-transform': cssVal,
                '-moz-tranform': cssVal,
                '-ms-tranform': cssVal,
                '-o-transform': cssVal,
                'transform': cssVal
            });
        }.observes('yOffset')
    });

    Ember.Handlebars.helper('spin-box-rows', SpinBoxRowsView);

    return SpinBoxRowsView;
});