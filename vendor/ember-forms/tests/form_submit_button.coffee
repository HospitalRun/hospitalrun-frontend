moduleForComponent('form', 'Form Submit Button Component'
    needs: ['component:form-submit', 'template:components/form-submit-button']
)

test "Form submit button rendering", ->
    #Default
    component = @subject
        submit_button: false
        template: Em.Handlebars.compile ('{{form-submit text="Submit!"}}')
    @$()

    equal @$().find('button').length, 1, '1 button found.'
    equal @$().find('button').text().trim(), 'Submit!', 'Submit button found.'

test "Form submit button is disabled when model isnt valid & enabled when is valid", ->
    component = @subject
        submit_button: false
        template: Em.Handlebars.compile ('{{form-submit text="Submit!"}}')
        model: Em.Object.create({isValid: false})
    @$()

    ok @$().find('button').attr('disabled'), 'Submit is disabled when model isValid = false'
    Ember.run (->
        component.set('model.isValid', true)
    )
    ok !@$().find('button').attr('disabled'), 'Submit is enabled when model isValid = true'


