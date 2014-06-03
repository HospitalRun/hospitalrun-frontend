moduleForComponent('form-control-help', 'Form Control Help Component');

test "Form Control Help rendering", ->
    component = @subject()
    ok(@$().hasClass('help-block'), 'DOM element has default css class')

test "Help extra css class", ->
    component = @subject
        extraClass: 'foo'
    ok(@$().hasClass('foo'), 'has extra css class')

test "Help text is rendered properly", ->
    component = @subject
        text: 'Hello'
    equal @$().text(), 'Hello', 'Help text is rendered.'

test "Help properties", ->
    component = @subject()
    #No text
    ok !@$().text()
    ok !component.get('helpText'), 'no help text'
    ok !component.get('hasHelp'), 'hasHelp is false'
    ok !component.get('hasError'), 'hasError is false'

    Em.run(->
        component.set 'text', 'Hello!'
    )

    equal @$().text(), 'Hello!', 'Help text is rendered.'
    ok component.get('helpText'), 'has help text'
    ok component.get('hasHelp'), 'hasHelp is true'
    ok !component.get('hasError'), 'hasError is false'

#TODO: Test that error message has higher priority than help text
test "Help error binding", ->
    component = @subject
        #mock the model
        model: Em.Object.create
            name: 'asaf'
            errors: Em.Object.create()
        property: 'name'
    @$()
    ok !component.get 'hasError', 'hasError is false as there is no errors at all.'

    Em.run(->
        component.set 'model.errors.age', ['age!']
    )

    ok !component.get('hasError'), 'hasError is false if errors has some props but not the bound prop'
    ok !component.get('helpText'), 'no help text if errors has some props but not the bound prop'
    ok !component.get('hasHelp'), 'hasHelp is false if errors has some props but not the bound prop'

    Em.run(->
        component.set 'model.errors.name', ['name!']
    )
    ok component.get('hasError'), 'hasError is true if prop has array with errors'
    ok component.get('hasHelp'), 'has help text'
    equal component.get('helpText'), 'name!', 'Help error text found!'

    Em.run(->
        component.set 'model.errors.name', []
    )
    ok !component.get('hasError'), 'hasError is false'
    ok !component.get('helpText'), 'no help text'
    ok !component.get('hasHelp'), 'hasHelp is false'




