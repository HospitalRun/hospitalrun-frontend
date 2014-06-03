moduleForComponent('form-group', 'Form Group Component'
    needs: ['template:components/_form-group', 'template:components/_form-group-control', 'template:components/form-label']
)

test "Form Group rendering", ->
    #Default
    component = @subject
        controlView: Em.View.extend
            template: Em.Handlebars.compile 'dummy control'
    ok(@$().hasClass('form-group'), 'DOM element has default form-group class')

    ok(!component.get('hasLabel'), 'group has no label')
    Ember.run(->
        component.set('label', 'hello')
    )
