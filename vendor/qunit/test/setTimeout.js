QUnit.config.updateRate = 1;

module( "Module that mucks with time", {
	setup: function() {
		this.setTimeout = window.setTimeout;
		window.setTimeout = function() {};
	},

	teardown: function() {
		window.setTimeout = this.setTimeout;
	}
});

test( "just a test", function( assert ) {
	assert.ok(true);
});
test( "just a test", function( assert ) {
	assert.ok(true);
});
