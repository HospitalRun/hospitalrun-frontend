moduleForComponent('form', 'In Form Mixin'
    needs: [
        'component:form-submit', 'template:components/form-submit-button',
        'component:form-input',
        'component:form-group', 'template:components/form-group', 'template:components/_form-group']
)

test "Get form & model", ->
    component = @subject
        submit_button: false
        ctrlView: Em.View.extend
            template: Em.Handlebars.compile 'dummy control'
        template: Em.Handlebars.compile ('{{#form-group controlView=view.ctrlView}}nothing{{/form-group}}')
        foo: 'myForm'
        model: {foo: 'bar'}
    @$()

    ok component.get('childViews').length is 1, '1 form child views found.'
    formGroupView = component.get('childViews')[0]
    #TODO: How to ensure that this is a form group view?
    ok formGroupView, 'form-group view found'
    form = formGroupView.get('form')
    ok form, 'form found'
    equal form.foo, 'myForm', 'correct form found.'

    ok formGroupView.get('model'), 'model found'
    equal formGroupView.get('model').foo, 'bar', 'correct model instance found.'

#TODO: Ensure @get('form') in nested forms returns the closest one to the element