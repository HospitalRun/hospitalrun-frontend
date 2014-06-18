(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(['ember'], function(Ember) { return factory(Ember); });
    } else if(typeof exports === 'object') {
        module.exports = factory(require('ember'));
    } else {
        root.SpinBoxRowComponent = factory(Ember);
    }
})(this, function(Ember) {
    
    var SpinBoxRowComponent = Ember.Component.extend({
        layoutName: 'components/spin-box-row',
        classNames: ['spinbox-row'],
        classNameBindings: ['selected'],
        attributeBindings: ['style'],

        selected: function() {
            return this.get('index') === this.get('parentView.parentView._selectedIndex');
        }.property('index', 'parentView.parentView._selectedIndex'),

        style: function() {
            return 'top:' + this.get('top') + 'px';
        }.property('top'),

        handleClick: function() {
            var selectedRow = this.get('parentView').findBy('selected', true);
            
            if(selectedRow && this.get('value') && !this.get('selected')) {
                this.get('parentView.parentView').spin(selectedRow.get('top') - this.get('top'), true);
            }
        }.on('click')
    });

    return SpinBoxRowComponent;
});
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
(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define([
            'ember', 
            './components/spin-box-row.js'
        ], function(Ember, Row) { 
            return factory(Ember, Row); 
        });
    } else if(typeof exports === 'object') {
        module.exports = factory(
            require('ember'),
            require('./components/spin-box-row.js')
        );
    } else {
        root.SpinBoxComponent = factory(
            Ember, 
            root.SpinBoxRowComponent
        );
    }
})(this, function(Ember, Row) {

    var SpinBoxComponent = Ember.Component.extend({
        layoutName: 'components/spin-box',
        classNames: ['spinbox'],
        attributeBindings: ['tabindex'],
        visibleRows: 5,
        rowHeight: 28,
        circular: true,
        tabindex: null,

        _bufferSize: 20,
        _defaultTransDuration: 400,
        _defaultTransTiming: 'ease',
        _totalSpinOffset: 0,
        _betweenRowOffset: 0,
        _momentumDuration: 800,

        setup: function() {
            //make sure visibleRows is an odd number
            if(this.get('visibleRows') % 2 !== 1) {
                this.incrementProperty('visibleRows');
            }

            this.$el = this.$();
            this.adjustHeight();
            this.$el.on('mousewheel DOMMouseScroll', Ember.run.bind(this, this.handleMouseWheel));
        }.on('didInsertElement'),

        teardown: function() {
            this.$el.off();
        }.on('willDestroyElement'),

        numRowViews: function() {
            return this.get('visibleRows') + (this.get('_bufferSize') * 2);
        }.property('_bufferSize', 'visibleRows'),

        maxSpinDistance: function() {
            return this.get('_bufferSize') * this.get('rowHeight');
        }.property('_bufferSize', 'rowHeight'),

        height: function() {
            return this.get('rowHeight') * this.get('visibleRows');
        }.property('rowHeight', 'visibleRows'),

        adjustHeight: function() {
            this.$el.height(this.get('height'));
        }.observes('height'),

        renderRows: function() {
            var rowView = Row,
                rowsView = this.get('rowsView'),
                rowH = this.get('rowHeight'),
                numRows = this.get('numRowViews'),
                val = this.get('value'),
                valIndex = this.indexOf(val),
                selIndex = valIndex === -1 ? this.get('floor') : valIndex,
                newVal = this.valueAt(selIndex),
                startIndex = selIndex - Math.floor(numRows / 2),
                views = [];

            this.setProperties({
                _selectedIndex: selIndex,
                _ignoreValueChange: (val !== newVal),
                value: valIndex === -1 ? newVal : val
            });

            for(var i=0; i<numRows; i++) {
                views.push(rowView.create({
                    index: startIndex + i,
                    value: this.valueAt(startIndex + i),
                    top: rowH * i
                }));
            }

            rowsView.disableTransitions();
            rowsView.setObjects(views);
            rowsView.positionEl();
        },

        valuesSource: function() {
            return Ember.isArray(this.get('content')) ? 'content' : (this.get('rangeIsValid') ? 'range' : null);
        }.property('content', 'rangeIsValid'),

        rangeIsValid: function() {
            var r = this.get('range');
            return (Ember.isArray(r) && r.length === 2 && typeof r[0] === 'number' && typeof r[1] === 'number' && r[0] <= r[1]);
        }.property('range'),

        floor: function() {
            var floor;
            switch(this.get('valuesSource')) {
                case 'range':
                    floor = this.get('range')[0];
                    break;
                default:
                    floor = 0;
                    break;
            }

            return floor;
        }.property('valuesSource'),

        ceiling: function() {
            var ceiling;
            switch(this.get('valuesSource')) {
                case 'content':
                    ceiling = this.get('content').length;
                    break;
                case 'range':
                    ceiling = this.get('range')[1] + 1;
                    break;
                default:
                    ceiling = 1;
                    break;
            }

            return ceiling;
        }.property('valuesSource'),

        valueAt: function(index) {
            var val;

            if(this.get('circular')) {
                index = this.adjustedIndex(index);
            }

            switch(this.get('valuesSource')) {
                case 'content':
                    val = this.get('content')[index];
                    break;
                case 'range':
                    val = index < this.get('floor') || index >= this.get('ceiling') ? undefined : index;
                    break;
                default:
                    val = undefined;
                    break;
            }

            return val;
        },

        indexOf: function(value) {
            var index, r;
            switch(this.get('valuesSource')) {
                case 'content':
                    index = this.get('content').indexOf(value);
                    break;
                case 'range':
                    r = this.get('range');
                    index = (Ember.isNone(value) || value < r[0] || value > r[1]) ? -1 : value;
                    break;
                default:
                    index = -1;
                    break;
            }

            return index;
        },

        selectedIndex: function() {
            return this.adjustedIndex(this.get('_selectedIndex'));
        }.property('_selectedIndex'),

        adjustedIndex: function(index) {
            var len = this.get('ceiling'),
                floor = this.get('floor'),
                src = this.get('valuesSource');

            if(index < floor) {
                while(index < floor) {
                    index = index % len;
                    index = index === 0 ? floor : len + index - floor;
                }
            } else if(index >= len) {
                while(index >= len) {
                    index = (index % len) + floor;
                }
            }

            return index;
        },

        cycleRows: function(direction) {
            var ct = this.get('rowsView'),
                rowH = this.get('rowHeight'),
                prevChild = ct.objectAt(direction === 'down' ? ct.get('childViews').length - 1 : 0),
                child = ct[direction === 'down' ? 'shiftObject' : 'popObject'](),
                newChildIndex = prevChild.get('index') + (direction === 'down' ? 1 : -1);

            ct[direction === 'down' ? 'pushObject' : 'unshiftObject'](child);
            child.setProperties({
                top: prevChild.get('top') + (direction === 'down' ? rowH : -rowH),
                index: newChildIndex,
                value: this.valueAt(newChildIndex)
            });
        },

        spin: function(yOffset, scheduleFinish) {
                var ct = this.get('rowsView'),
                rowH = this.get('rowHeight'),
                curOffset = ct.get('yOffset'),
                selIndex = this.get('_selectedIndex'),
                curIndex = selIndex !== null ? selIndex : this.get('_prevSelectedIndex'),
                totalOffset = this.get('_totalSpinOffset') + yOffset,
                betweenRowOffset = this.get('_betweenRowOffset') + yOffset,
                newIndex = curIndex + ((totalOffset / rowH) * -1);

            if(!this.get('circular') && (newIndex < this.get('floor') || Math.ceil(newIndex) >= this.get('ceiling'))) {
                if(Math.abs(yOffset) > rowH) {
                    this.get('rowsView').enableTransitions(this.get('_momentumDuration') / 2, 'cubic-bezier(0.250, 0.460, 0.450, 0.940)');

                    if(Math.ceil(newIndex) >= this.get('ceiling')) {
                        yOffset += (newIndex - (this.get('ceiling') - 1)) * rowH;
                    } else {
                        yOffset -= (this.get('floor') - newIndex) * rowH;
                    }

                    totalOffset = this.get('_totalSpinOffset') + yOffset;
                    betweenRowOffset = this.get('_betweenRowOffset') + yOffset;
                } else {
                    return;
                }
            }

            Ember.run.cancel(this.get('_finishSpinTimer'));

            if(Math.abs(betweenRowOffset) >= rowH) {
                for(var i = 0; i < Math.floor(Math.abs(betweenRowOffset) / rowH); i++) {
                    this.cycleRows(yOffset < 0 ? 'down' : 'up');    
                }

                betweenRowOffset = betweenRowOffset % rowH;
            }
            
            ct.adjustYOffset(yOffset);
            this.setProperties({
                _prevSelectedIndex: curIndex,
                _selectedIndex: null,
                _totalSpinOffset: totalOffset,
                _betweenRowOffset: betweenRowOffset,
                _finishSpinTimer: scheduleFinish ? Ember.run.later(this, this.finishSpin, this.get('_transDuration')) : null
            });
        },

        finishSpin: function() {
            var offset = this.get('_totalSpinOffset'),
                rowH = this.get('rowHeight'),
                overSpin = Math.abs(offset % rowH),
                prevIndex = this.get('_prevSelectedIndex'),
                newIndex,
                newValue,
                floorDist,
                ceilDist;

            this.get('rowsView').enableTransitions();
            //if there was no change in the offset, just revert back to the previously selected value
            if(offset === 0) {
                return this.setProperties({
                    _selectedIndex: prevIndex !== null ? prevIndex : this.get('_selectedIndex'),
                    _prevSelectedIndex: null,
                    _totalSpinOffset: 0,
                    _betweenRowOffset: 0
                });
            }

            if(overSpin > 0) {
                this.get('rowsView').enableTransitions(200);
                if(overSpin < (rowH / 2)) {
                    return this.spin(offset < 0 ? overSpin : -overSpin, true);
                } else {
                    return this.spin(offset < 0 ? -(rowH - overSpin) : rowH - overSpin, true);
                }
            }

            newIndex = prevIndex + ((offset / rowH) * -1);
            newValue = this.valueAt(newIndex);
            this.setProperties({
                _totalSpinOffset: 0,
                _betweenRowOffset: 0,
                _selectedIndex: newIndex,
                _prevSelectedIndex: null,
                _ignoreValueChange: true,
                value: newValue
            });

            this.correctRowPositions();

            //send the action after all bindings have been synced
            Ember.run.scheduleOnce('sync', this, function() {
                this.sendAction('onUpdate', newValue, this.adjustedIndex(newIndex));
            });
        },

        correctRowPositions: function() {
            var ct = this.get('rowsView'),
                selRowIndex = ct.indexOf(ct.findBy('selected', true)),
                centerIndex = Math.ceil(ct.get('childViews').length / 2) - 1,
                offset = centerIndex - selRowIndex;

            if(offset !== 0) {
                for(var i = 0; i < Math.abs(offset); i++) {
                    this.cycleRows(offset < 0 ? 'down' : 'up');
                }
            }
        },

        startMomentumSpin: function(touchDist, touchTime) {
            var accel = Math.abs(touchDist / touchTime),
                offset = Math.min((Math.pow(accel, 2) * this.get('height')), this.get('maxSpinDistance'));
            
            if(touchDist < 0) offset *= -1;

            this.get('rowsView').enableTransitions(this.get('_momentumDuration'), 'cubic-bezier(0.250, 0.460, 0.450, 0.940)');
            this.spin(offset, true);
        },

        handleParamsChange: function() {
            Ember.run.scheduleOnce('afterRender', this, this.renderRows);
        }.observes('content', 'range', 'circular'),

        handleValueChange: function() {
            if(this.get('_ignoreValueChange')) {
                this.set('_ignoreValueChange', false);
            } else {
                Ember.run.scheduleOnce('afterRender', this, this.renderRows);
            }
        }.observes('value'),

        handleSpinUpWhen: function() {
            if(!this.get('spinUpWhen')) return;
            this.spin(this.get('rowHeight'), true);
            this.set('spinUpWhen', false);
        }.observes('spinUpWhen'),

        handleSpinDownWhen: function() {
            if(!this.get('spinDownWhen')) return;
            this.spin(-this.get('rowHeight'), true);
            this.set('spinDownWhen', false);
        }.observes('spinDownWhen'),

        handleTouchStart: function(e) {
            this.setProperties({
                _touchStartTime: e.timeStamp,
                _touchStartY: e.originalEvent.touches[0].pageY,
                _touchDist: 0
            });

            this.get('rowsView').disableTransitions();
            e.preventDefault();
        }.on('touchStart'),

        handleTouchMove: function(e) {
            var pageY = e.originalEvent.touches[0].pageY,
                prevY = this.get('_touchMoveY') ? this.get('_touchMoveY') : this.get('_touchStartY'),
                offset = pageY - prevY;
            
            this.setProperties({
                _touchMoveTime: e.timeStamp,
                _touchMoveY: pageY,
                _touchDist: this.get('_touchDist') + offset
            });

            this.spin(offset, false);
            e.preventDefault();
        }.on('touchMove'),

        handleTouchEnd: function(e) {
            var touchTime = e.timeStamp - this.get('_touchStartTime'),
                dist = this.get('_touchDist');

            this.setProperties({
                _touchEndTime: e.timeStamp,
                _touchMoveY: null
            });

            //if a swipe occurred, kick off a momentum spin phase
            if(touchTime < 300 && Math.abs(dist) > 20) {
                this.startMomentumSpin(dist, touchTime);
            } else {
                this.finishSpin();
            }

            e.preventDefault();
        }.on('touchEnd'),

        handleKeyDown: function(e) {
            if(e.keyCode != 38 && e.keyCode != 40) return;
            e.preventDefault();
            this.spin((e.keyCode == 38 ? 1 : -1) * this.get('rowHeight'), true);
        }.on('keyDown'),

        handleMouseWheel: function(e) {
            var origEvent = e.originalEvent,
                offset = ((origEvent.wheelDelta > 0 || origEvent.detail < 0) ? 1 : -1) * this.get('rowHeight');
            e.preventDefault();
            this.spin(offset, true);
        },

        registerRowsView: function(view) {
            this.set('rowsView', view);
            this.renderRows();
        }
    });
    
    return SpinBoxComponent;
});
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
(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(['ember'], function(Ember) { return factory(Ember); });
    } else if(typeof exports === 'object') {
        factory(require('ember'));
    } else {
        factory(Ember);
    }
})(this, function(Ember) {


Ember.TEMPLATES["components/spin-box-row"]=Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var stack1;


  stack1 = helpers._triageMustache.call(depth0, "value", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
  
});
Ember.TEMPLATES["components/spin-box"]=Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1;


  stack1 = helpers._triageMustache.call(depth0, "spin-box-rows", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  stack1 = helpers._triageMustache.call(depth0, "spin-box-selection-win", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  return buffer;
  
});

});
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