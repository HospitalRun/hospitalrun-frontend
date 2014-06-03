moduleForComponent('form', 'FormComponent'
    needs: ['component:form-submit', 'template:components/form-submit-button']
)

FormController = Em.ObjectController.extend
    actions:
        submit: ->
            ok(true, 'submit action invoked!');

FormControllerCustomAction = Em.ObjectController.extend
    actions:
        submitNow: ->
            ok(true, 'submitNow action invoked!');

somePerson = Em.Object.create
    name: 'asaf'
    errors: Ember.Object.create()
    validate: ->
        promise = new Ember.RSVP.Promise((resolve)->
            resolve("ok")
        )
        promise


test "Form rendering", ->
    component = @subject()
    equal(@$().attr("role"), "form", 'form has role.')
    ok($.find('form').get(0), 'form got rendered.')
    ok(!component.get('model'), 'model does not exist.')
    ok(@$().find('button').get(0), 'submit button has rendered')

test "Submit button rendering", ->
    component = @subject()
    ok(@$().find('button').get(0), "submit button got rendered.")
    Ember.run(->
        component.set('submit_button', false)
    )
    ok(!@$().find('button').get(0), 'no submit button.')

test "form.layout", ->
    #Default
    component = @subject()
    component.set('form_layout','form')
    ok(@$().hasClass('form'))
    ok(!@$().hasClass('form-inline'))
    ok(!@$().hasClass('form-horizontal'))
    ok(component.get('isDefaultLayout'))
    ok(!component.get('isInline'))
    ok(!component.get('isHorizontal'))

    #Inline
    Ember.run(->
        component.set('form_layout','inline')
    )
    ok(@$().hasClass('form-inline'))
    ok(!@$().hasClass('form'))
    ok(!@$().hasClass('form-horizontal'))
    ok(!component.get('isDefaultLayout'))
    ok(component.get('isInline'))
    ok(!component.get('isHorizontal'))

    #Horizontal
    Ember.run(->
        component.set('form_layout','horizontal')
    )
    ok(@$().hasClass('form-horizontal'))
    ok(!@$().hasClass('form-inline'))
    ok(!@$().hasClass('form'))
    ok(!component.get('isDefaultLayout'))
    ok(!component.get('isInline'))
    ok(component.get('isHorizontal'))

test "Ensure model is set", ->
    component = @subject(
        model: somePerson
    )

    equal(component.get('model.name'), 'asaf', 'model was set.')

test "Form cannot be submitted if model is invalid", ->
    expect 0
    component = @subject(
        targetObject: FormController.create()
        model: somePerson
    )

    $component = @.append();

    Ember.run(->
        component.get('model').set('isValid', false)
    )

    click('button')

test "Form can be submitted if a validation supported model is valid", ->
    expect 1
    component = @subject(
        targetObject: FormController.create()
        model: somePerson
    )

    $component = @.append()

    Ember.run(->
        component.get('model').set('isValid', true)
    )

    click('button')

test "Form submission with custom action", ->
    expect 1
    component = @subject(
        targetObject: FormControllerCustomAction.create()
        model: somePerson
    )

    $component = @.append()

    Ember.run(->
        component.get('model').set('isValid', true)
        component.set('action', 'submitNow')
    )

    click('button')

test "Form submission with a model that has no validation support and no isValid property should be submitted", ->
    expect 1
    component = @subject(
        targetObject: FormController.create()
        model: {}
    )

    $component = @.append()

    click('button')
