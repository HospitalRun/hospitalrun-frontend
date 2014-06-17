/**
 * initial component properties
 * value: "May 15, 2014"
 * dateFormat: "MMMM D, YYYY"
 */
module('Controls toggling', {
    setup: function() {
        App.reset();
        visit('/');
    }
});

test('focusing input shows the controls', function() {
    expect(1);
    openControls();

    andThen(function() {
        ok(find('div.datepicker-controls').is(':visible'), 'controls are visible');
    });
});

test('clicking elsewhere in the document hides the controls', function() {
    expect(1);
    openControls();
    click(document);

    andThen(function() {
        ok(find('div.datepicker-controls').is(':hidden'), 'controls are hidden');
    });
});

module('Date selection', {
    setup: function() {
        App.reset();
        visit('/');
        openControls();
    }
});

test('controls display the current date value', function() {
    expect(1);
    
    andThen(function() {
        equal(
            find('.datepicker-col-month .spinbox-row.selected').text() + ' ' +
            find('.datepicker-col-day .spinbox-row.selected').text() + ', ' +
            find('.datepicker-col-year .spinbox-row.selected').text(), 
            'May 15, 2014'
        );
    });
});

test('clicking "Today" button sets current date as the selected date', function() {
    var monthNames = ["January", "February", "March", "April", "May", "June",  "July", "August", "September", "October", "November", "December"],
        date = new Date(),
        currentDate = monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();

    expect(1);
    click('button.datepicker-btn-today');

    andThen(function() {
        equal(
            find('.datepicker-col-month .spinbox-row.selected').text() + ' ' +
            find('.datepicker-col-day .spinbox-row.selected').text() + ', ' +
            find('.datepicker-col-year .spinbox-row.selected').text(), 
            currentDate
        );
    });
});

test('clicking "Clear" button clears the input\'s value', function() {
    expect(1);
    click('button.datepicker-btn-clear');

    andThen(function() {
        equal(find('input.datepicker-input').val(), '');
    });
});

test('Changing the spin box values updates the input\'s value', function() {
    expect(1);
    click('.datepicker-col-month .spinbox-row:nth-of-type(5)');
    click('.datepicker-col-day .spinbox-row:nth-of-type(5)');
    click('.datepicker-col-year .spinbox-row:nth-of-type(5)');


    andThen(function() {
        equal(
            find('input.datepicker-input').val(), 
            'June 16, 2015'
        );
    });
});

function openControls() {
    triggerEvent('input.datepicker-input', 'focus');
}