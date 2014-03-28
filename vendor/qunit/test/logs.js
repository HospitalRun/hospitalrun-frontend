// TODO disable reordering for this suite!

var begin = 0,
	moduleStart = 0,
	moduleDone = 0,
	testStart = 0,
	testDone = 0,
	log = 0,
	moduleContext,
	moduleDoneContext,
	testContext,
	testDoneContext,
	logContext;

QUnit.begin(function() {
	begin++;
});
QUnit.done(function() {
});
QUnit.moduleStart(function(context) {
	moduleStart++;
	moduleContext = context;
});
QUnit.moduleDone(function(context) {
	moduleDone++;
	moduleDoneContext = context;
});
QUnit.testStart(function(context) {
	testStart++;
	testContext = context;
});
QUnit.testDone(function(context) {
	testDone++;
	testDoneContext = context;
});
QUnit.log(function(context) {
	log++;
	logContext = context;
});

module("logs1");

test("test1", 15, function( assert ) {
	assert.equal( begin, 1, "QUnit.begin calls" );
	assert.equal( moduleStart, 1, "QUnit.moduleStart calls" );
	assert.equal( testStart, 1, "QUnit.testStart calls" );
	assert.equal( testDone, 0, "QUnit.testDone calls" );
	assert.equal( moduleDone, 0, "QUnit.moduleDone calls" );
	assert.deepEqual( logContext, {
		name: "test1",
		module: "logs1",
		result: true,
		message: "QUnit.moduleDone calls",
		actual: 0,
		expected: 0
	}, "log context after equal(actual, expected, message)" );

	assert.equal( "foo", "foo" );
	assert.deepEqual(logContext, {
		name: "test1",
		module: "logs1",
		result: true,
		message: undefined,
		actual: "foo",
		expected: "foo"
	}, "log context after equal(actual, expected)" );

	assert.ok( true, "ok(true, message)" );
	assert.deepEqual( logContext, {
		module: "logs1",
		name: "test1",
		result: true,
		message: "ok(true, message)"
	}, "log context after ok(true, message)" );

	assert.strictEqual( testDoneContext, undefined, "testDone context" );
	assert.deepEqual( testContext, {
		module: "logs1",
		name: "test1"
	}, "test context" );
	assert.strictEqual( moduleDoneContext, undefined, "moduleDone context" );
	assert.deepEqual( moduleContext, {
		name: "logs1"
	}, "module context" );

	assert.equal( log, 14, "QUnit.log calls" );
});
test("test2", 11, function( assert ) {
	assert.equal( begin, 1, "QUnit.begin calls" );
	assert.equal( moduleStart, 1, "QUnit.moduleStart calls" );
	assert.equal( testStart, 2, "QUnit.testStart calls" );
	assert.equal( testDone, 1, "QUnit.testDone calls" );
	assert.equal( moduleDone, 0, "QUnit.moduleDone calls" );

	assert.ok( typeof testDoneContext.duration === "number" , "testDone context: duration" );
	delete testDoneContext.duration;
	assert.deepEqual( testDoneContext, {
		module: "logs1",
		name: "test1",
		failed: 0,
		passed: 15,
		total: 15
	}, "testDone context" );
	assert.deepEqual( testContext, {
		module: "logs1",
		name: "test2"
	}, "test context" );
	assert.strictEqual( moduleDoneContext, undefined, "moduleDone context" );
	assert.deepEqual( moduleContext, {
		name: "logs1"
	}, "module context" );

	assert.equal( log, 25, "QUnit.log calls" );
});

module("logs2");

test( "test1", 9, function( assert ) {
	assert.equal( begin, 1, "QUnit.begin calls" );
	assert.equal( moduleStart, 2, "QUnit.moduleStart calls" );
	assert.equal( testStart, 3, "QUnit.testStart calls" );
	assert.equal( testDone, 2, "QUnit.testDone calls" );
	assert.equal( moduleDone, 1, "QUnit.moduleDone calls" );

	assert.deepEqual( testContext, {
		module: "logs2",
		name: "test1"
	}, "test context" );
	assert.deepEqual( moduleDoneContext, {
		name: "logs1",
		failed: 0,
		passed: 26,
		total: 26
	}, "moduleDone context" );
	assert.deepEqual( moduleContext, {
		name: "logs2"
	}, "module context" );

	assert.equal( log, 34, "QUnit.log calls" );
});
test( "test2", 8, function( assert ) {
	assert.equal( begin, 1, "QUnit.begin calls" );
	assert.equal( moduleStart, 2, "QUnit.moduleStart calls" );
	assert.equal( testStart, 4, "QUnit.testStart calls" );
	assert.equal( testDone, 3, "QUnit.testDone calls" );
	assert.equal( moduleDone, 1, "QUnit.moduleDone calls" );

	assert.deepEqual( testContext, {
		module: "logs2",
		name: "test2"
	}, "test context" );
	assert.deepEqual( moduleContext, {
		name: "logs2"
	}, "module context" );

	assert.equal( log, 42, "QUnit.log calls" );
});

var testAutorun = true;

QUnit.done(function() {

	if (!testAutorun) {
		return;
	}

	testAutorun = false;

	moduleStart = moduleDone = 0;

	// Since these tests run *after* done, and as such
	// QUnit is not able to know whether more tests are coming
	// the module starts/ends after each test.
	module("autorun");

	test("first", function( assert ) {
		assert.equal(moduleStart, 1, "test started");
		assert.equal(moduleDone, 0, "test in progress");
	});

	test("second", function( assert ) {
		assert.equal(moduleStart, 2, "test started");
		assert.equal(moduleDone, 1, "test in progress");
	});
});
