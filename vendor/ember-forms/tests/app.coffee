document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>')
Ember.testing = true

Ember.Router.reopen
    location: 'none'

Ember.run(->
    App = window.App = Ember.Application.create(
        rootElement: '#ember-testing'
        LOG_ACTIVE_GENERATION:false
        LOG_VIEW_LOOKUPS: false
    )
    App.setupForTesting()
    App.injectTestHelpers()
)

emq.globalize()
setResolver(Ember.DefaultResolver.create({namespace: Ember.Forms}))

#Run before each test case.
QUnit.testStart(->
    Ember.run(() ->
        App.reset()
    )
    Ember.testing = true
)

#Run after each test case.
QUnit.testDone(() ->
    Ember.testing = false
)

# Optional: Clean up after our last test so you can try out the app in the jsFiddle.
QUnit.done(() ->
    Ember.run(() ->
        App.reset()
    )
)