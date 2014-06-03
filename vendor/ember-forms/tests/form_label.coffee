moduleForComponent('form-label', 'Form Label Component')

test "Label rendering", ->
    component = @subject
        for: 'name'
    equal(@$().attr("for"), "name", 'form has for property.')
    ok(@$().hasClass('control-label'), 'label has default class')

test "Label extra css class", ->
    component = @subject
        extraClass: 'foo'
    ok(@$().hasClass('foo'), 'label has extra css class')

test "Label text is set", ->
    component = @subject
        text: 'Some Text'
    ok(@$().text, 'Some Text')

test "Label as block", ->
    component = @subject
        template: Em.Handlebars.compile 'Hello'
    equal @$().text().trim(), 'Hello', 'Label rendered as block'

#TODO: test "Has sr-only if form is inline"/horiClass is only active if form is horizontal, requires form component