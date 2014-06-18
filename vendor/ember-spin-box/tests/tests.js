var animationDuration = 60;

module('Basic interactions', {
    setup: function() {
        App.reset();
        visit('/');
    }
});

test('the first element in the content array is selected', function() {
    expect(1);
    equal(find('.spinbox-row.selected').text(), 'apple');
});

test('mousewheel down selects the next element in the content array', function() {
    var event = Em.$.Event('mousewheel', {originalEvent: {wheelDelta: -1}}),
        firefoxEvent = Em.$.Event('mousewheel', {originalEvent: {detail: 1}});

    expect(1);
    Em.$('.spinbox')
        .trigger(event)
        .trigger(firefoxEvent);
    wait();

    andThen(function() {
        Ember.run.later(this, function() {
            equal(find('.spinbox-row.selected').text(), 'orange');
        }, animationDuration);
    });
});

test('mousewheel up cycles to and selects the last element in the content array', function() {
    var event = Em.$.Event('mousewheel', {originalEvent: {wheelDelta: 1}}),
        firefoxEvent = Em.$.Event('mousewheel', {originalEvent: {detail: -1}});

    expect(1);
    Em.$('.spinbox')
        .trigger(event)
        .trigger(firefoxEvent);
    wait();

    andThen(function() {
        Ember.run.later(this, function() {
            equal(find('.spinbox-row.selected').text(), 'apricot');
        }, animationDuration);
    });
});

test('down arrow keydown selects the next element in the content array', function() {
    expect(1);
    keyEvent('.spinbox', 'keydown', 40);

    andThen(function() {
        Ember.run.later(this, function() {
            equal(find('.spinbox-row.selected').text(), 'orange');
        }, animationDuration);
    });
});

test('up arrow keydown cycles to and selects the last element in the content array', function() {
    expect(1);
    keyEvent('.spinbox', 'keydown', 38);

    andThen(function() {
        Ember.run.later(this, function() {
            equal(find('.spinbox-row.selected').text(), 'apricot');
        }, animationDuration);
    });
});

test('clicking an unselected row selects it', function() {
    expect(1);
    click('.spinbox-row:nth-of-type(6)');

    andThen(function() {
        equal(find('.spinbox-row.selected').text(), 'banana');
    });
});