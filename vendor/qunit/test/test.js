function getPreviousTests( rTestName, rModuleName ) {
	var testSpan, moduleSpan,
		matches = [],
		i = 0,
		rModule = /(^| )module-name( |$)/,
		testNames = typeof document.getElementsByClassName !== "undefined" ?
			document.getElementsByClassName("test-name") :
			(function( spans ) {
				var span,
					tests = [],
					i = 0,
					rTest = /(^| )test-name( |$)/;
				for ( ; (span = spans[i]); i++ ) {
					if ( rTest.test( span.className ) ) {
						tests.push( span );
					}
				}
				return tests;
			})( document.getElementsByTagName("span") );

	for ( ; (testSpan = testNames[i]); i++ ) {
		moduleSpan = testSpan;
		while ( (moduleSpan = moduleSpan.previousSibling) ) {
			if ( rModule.test( moduleSpan.className ) ) {
				break;
			}
		}
		if ( (!rTestName || rTestName.test( testSpan.innerHTML )) &&
			(!rModuleName || moduleSpan && rModuleName.test( moduleSpan.innerHTML )) ) {

			while ( (testSpan = testSpan.parentNode) ) {
				if ( testSpan.nodeName.toLowerCase() === "li" ) {
					matches.push( testSpan );
				}
			}
		}
	}
	return matches;
}

test("module without setup/teardown (default)", function( assert ) {
	expect(1);
	assert.ok(true);
});

test("expect in test", 3, function( assert ) {
	assert.ok(true);
	assert.ok(true);
	assert.ok(true);
});

test("expect in test", 1, function( assert ) {
	assert.ok(true);
});

test("expect query and multiple issue", function( assert ) {
	expect(2);
	assert.ok(true);
	var expected = expect();
	assert.equal(expected, 2);
	expect(expected + 1);
	assert.ok(true);
});

QUnit.module("assertion helpers");

QUnit.test( "QUnit.assert compatibility", 5, function( assert ) {
	assert.ok( true, "Calling method on `assert` argument to test() callback" );

	// Should also work, although discouraged and not documented
	QUnit.assert.ok( true, "Calling method on QUnit.assert object" );

	// Test compatibility aliases
	QUnit.ok( true, "Calling aliased method in QUnit root object" );
	assert.ok( true, "Calling aliased function in global namespace" );

	// Regression fix for #341
	// The assert-context way of testing discouraged global variables,
	// it doesn't make sense of it itself to be a global variable.
	// Only allows for mistakes (e.g. forgetting to list 'assert' as parameter)
	assert.notStrictEqual( window.assert, QUnit.assert, "Assert does not get exposed as a global variable" );
});

module("setup test", {
	setup: function( assert ) {
		assert.ok(true);
	}
});

test("module with setup", function( assert ) {
	expect(2);
	assert.ok(true);
});

test("module with setup, expect in test call", 2, function( assert ) {
	assert.ok(true);
});

module("<script id='qunit-unescaped-module'>'module';</script>", {
	setup: function() {
	},
	teardown: function( assert ) {
		// We can't use ok(false) inside script tags since some browsers
		// don't evaluate script tags inserted through innerHTML after domready.
		// Counting them before/after doesn't cover everything either as qunit-modulefilter
		// is created before any test is ran. So use ids instead.
		if (document.getElementById('qunit-unescaped-module')) {
			// This can either be from in #qunit-modulefilter or #qunit-testresult
			assert.ok(false, 'Unescaped module name');
		}
		if (document.getElementById('qunit-unescaped-test')) {
			assert.ok(false, 'Unescaped test name');
		}
		if (document.getElementById('qunit-unescaped-assertion')) {
			assert.ok(false, 'Unescaped test name');
		}
	}
});

test("<script id='qunit-unescaped-test'>'test';</script>", 1, function( assert ) {
	assert.ok(true, "<script id='qunit-unescaped-asassertionsert'>'assertion';</script>");
});

var state;

module("setup/teardown test", {
	setup: function( assert ) {
		state = true;
		assert.ok(true);
		// Assert that we can introduce and delete globals in setup/teardown
		// without noglobals sounding any alarm.

		// Using an implied global variable instead of explicit window property
		// because there is no way to delete a window.property in IE6-8
		// `delete x` only works for `x = 1, and `delete window.x` throws exception.
		// No one-code fits all solution possible afaic. Resort to @cc.

		/*@cc_on
			@if (@_jscript_version < 9)
				x = 1;
			@else @*/
				window.x = 1;
			/*@end
		@*/
	},
	teardown: function( assert ) {
		assert.ok(true);

		/*@cc_on
			@if (@_jscript_version < 9)
				delete x;
			@else @*/
				delete window.x;
			/*@end
		@*/
	}
});

test("module with setup/teardown", function( assert ) {
	expect(3);
	assert.ok(true);
});

module("setup/teardown test 2");

test("module without setup/teardown", function( assert ) {
	expect(1);
	assert.ok(true);
});

var orgDate;

module("Date test", {
	setup: function( assert ) {
		orgDate = Date;
		window.Date = function () {
			assert.ok( false, 'QUnit should internally be independent from Date-related manipulation and testing' );
			return new orgDate();
		};
	},
	teardown: function() {
		window.Date = orgDate;
	}
});

test("sample test for Date test", function ( assert ) {
	expect(1);
	assert.ok(true);
});

if (typeof setTimeout !== 'undefined') {
state = 'fail';

module("teardown and stop", {
	teardown: function( assert ) {
		assert.equal(state, "done", "Test teardown.");
	}
});

test("teardown must be called after test ended", function() {
	expect(1);
	stop();
	setTimeout(function() {
		state = "done";
		start();
	}, 13);
});

test("parameter passed to stop increments semaphore n times", function() {
	expect(1);
	stop(3);
	setTimeout(function() {
		state = "not enough starts";
		start();
		start();
	}, 13);
	setTimeout(function() {
		state = "done";
		start();
	}, 15);
});

test("parameter passed to start decrements semaphore n times", function() {
	expect(1);
	stop();
	stop();
	stop();
	setTimeout(function() {
		state = "done";
		start(3);
	}, 18);
});

module("async setup test", {
	setup: function( assert ) {
		stop();
		setTimeout(function() {
			assert.ok(true);
			start();
		}, 500);
	}
});

asyncTest("module with async setup", function( assert ) {
	expect(2);
	assert.ok(true);
	start();
});

module("async teardown test", {
	teardown: function( assert ) {
		stop();
		setTimeout(function() {
			assert.ok(true);
			start();
		}, 500);
	}
});

asyncTest("module with async teardown", function( assert ) {
	expect(2);
	assert.ok(true);
	start();
});

module("asyncTest");

asyncTest("asyncTest", 2, function( assert ) {
	assert.ok(true);
	setTimeout(function() {
		state = "done";
		assert.ok(true);
		start();
	}, 13);
});

asyncTest("asyncTest with expect()", function( assert ) {
	expect(2);
	assert.ok(true);
	setTimeout(function() {
		state = "done";
		assert.ok(true);
		start();
	}, 13);
});

test("sync", 2, function( assert ) {
	stop();
	setTimeout(function() {
		assert.ok(true);
		start();
	}, 13);
	stop();
	setTimeout(function() {
		assert.ok(true);
		start();
	}, 125);
});

test("test synchronous calls to stop", 2, function( assert ) {
	stop();
	setTimeout(function() {
		assert.ok(true, 'first');
		start();
		stop();
		setTimeout(function() {
			assert.ok(true, 'second');
			start();
		}, 150);
	}, 150);
});
}

module("save scope", {
	setup: function() {
		this.foo = "bar";
	},
	teardown: function( assert ) {
		assert.deepEqual(this.foo, "bar");
	}
});
test("scope check", function( assert ) {
	expect(2);
	assert.deepEqual(this.foo, "bar");
});

module("simple testEnvironment setup", {
	foo: "bar",
	// example of meta-data
	bugid: "#5311"
});
test("scope check", function( assert ) {
	assert.deepEqual(this.foo, "bar");
});
test("modify testEnvironment", function() {
	expect(0);
	this.foo = "hamster";
});
test("testEnvironment reset for next test", function( assert ) {
	assert.deepEqual(this.foo, "bar");
});

module("testEnvironment with object", {
	options: {
		recipe: "soup",
		ingredients: ["hamster", "onions"]
	}
});
test("scope check", function( assert ) {
	assert.deepEqual(this.options, {
		recipe: "soup",
		ingredients: ["hamster", "onions"]
	});
});
test("modify testEnvironment",function() {
	expect(0);
	// since we only do a shallow copy, nested children of testEnvironment can be modified
	// and survice
	this.options.ingredients.push("carrots");
});
test("testEnvironment reset for next test",function( assert ) {
	assert.deepEqual(this.options, {
		recipe: "soup",
		ingredients: ["hamster", "onions", "carrots"]
	}, "Is this a bug or a feature? Could do a deep copy") ;
});


module("testEnvironment tests");

function makeurl() {
	var testEnv = QUnit.config.current.testEnvironment;
	var url = testEnv.url || 'http://example.com/search';
	var q   = testEnv.q   || 'a search test';
	return url + '?q='+encodeURIComponent(q);
}

test("makeurl working", 3, function( assert ) {
	assert.equal( QUnit.config.current.testEnvironment, this, 'The current testEnvironment QUnit.config');
	/*jshint camelcase:false */
	assert.equal( QUnit.current_testEnvironment, this, 'The current testEnvironment is in QUnit.config (old way)');
	/*jshint camelcase:true */
	assert.equal( makeurl(), 'http://example.com/search?q=a%20search%20test', 'makeurl returns a default url if nothing specified in the testEnvironment');
});

module("testEnvironment with makeurl settings", {
	url: 'http://google.com/',
	q: 'another_search_test'
});
test("makeurl working with settings from testEnvironment", function( assert ) {
	assert.equal( makeurl(), 'http://google.com/?q=another_search_test', 'rather than passing arguments, we use test metadata to from the url');
});

module("jsDump");
test("jsDump output", function( assert ) {
	assert.equal( QUnit.jsDump.parse([1, 2]), "[\n  1,\n  2\n]" );
	assert.equal( QUnit.jsDump.parse({top: 5, left: 0}), "{\n  \"left\": 0,\n  \"top\": 5\n}" );
	if (typeof document !== 'undefined' && document.getElementById("qunit-header")) {
		assert.equal( QUnit.jsDump.parse(document.getElementById("qunit-header")), "<h1 id=\"qunit-header\"></h1>" );
		assert.equal( QUnit.jsDump.parse(document.getElementsByTagName("h1")), "[\n  <h1 id=\"qunit-header\"></h1>\n]" );
	}
});

module("assertions");

test("propEqual", 5, function( assert ) {
	var objectCreate = Object.create || function ( origin ) {
		function O() {}
		O.prototype = origin;
		var r = new O();
		return r;
	};

	function Foo( x, y, z ) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	Foo.prototype.doA = function () {};
	Foo.prototype.doB = function () {};
	Foo.prototype.bar = 'prototype';

	function Bar() {
	}
	Bar.prototype = objectCreate( Foo.prototype );
	Bar.prototype.constructor = Bar;

	assert.propEqual(
		new Foo( 1, '2', [] ),
		{
			x: 1,
			y: '2',
			z: []
		}
	);

	assert.notPropEqual(
		new Foo( '1', 2, 3 ),
		{
			x: 1,
			y: '2',
			z: 3
		},
		'Primitive values are strictly compared'
	);

	assert.notPropEqual(
		new Foo( 1, '2', [] ),
		{
			x: 1,
			y: '2',
			z: {}
		},
		'Array type is preserved'
	);

	assert.notPropEqual(
		new Foo( 1, '2', {} ),
		{
			x: 1,
			y: '2',
			z: []
		},
		'Empty array is not the same as empty object'
	);

	assert.propEqual(
		new Foo( 1, '2', new Foo( [ 3 ], new Bar(), null ) ),
		{
			x: 1,
			y: '2',
			z: {
				x: [ 3 ],
				y: {},
				z: null
			}
		},
		'Complex nesting of different types, inheritance and constructors'
	);
});

test("raises", 9, function( assert ) {
	/*jshint es5:true */
	function CustomError( message ) {
		this.message = message;
	}

	CustomError.prototype.toString = function() {
		return this.message;
	};

	assert.throws(
		function() {
			throw "my error";
		}
	);

	assert.throws(
		function() {
			throw "my error";
		},
		"simple string throw, no 'expected' value given"
	);

	// This test is for IE 7 and prior which does not properly
	// implement Error.prototype.toString
	assert.throws(
		function() {
			throw new Error("error message");
		},
		/error message/,
		"use regexp against instance of Error"
	);

	assert.throws(
		function() {
			throw new CustomError();
		},
		CustomError,
		'thrown error is an instance of CustomError'
	);

	assert.throws(
		function() {
			throw new CustomError("some error description");
		},
		/description/,
		"use a regex to match against the stringified error"
	);

	assert.throws(
		function() {
			throw new CustomError("some error description");
		},
		function( err ) {
			if ( (err instanceof CustomError) && /description/.test(err) ) {
				return true;
			}
		},
		"custom validation function"
	);

	assert.throws(
		function() {
			/*jshint evil:true */
			( window.execScript || function( data ) {
				window["eval"].call( window, data );
			})( "throw 'error';" );
		},
		'globally-executed errors caught'
	);

    this.CustomError = CustomError;

    assert.throws(
        function() {
            throw new this.CustomError("some error description");
        },
        /description/,
        "throw error from property of 'this' context"
    );

    raises(
        function() {
            throw "error";
        },
        "simple throw, asserting with deprecated raises() function"
    );

});

if (typeof document !== "undefined") {

module("fixture");
test("setup", function() {
	expect(0);
	document.getElementById("qunit-fixture").innerHTML = "foobar";
});

test("basics", function( assert ) {
	assert.equal( document.getElementById("qunit-fixture").innerHTML, "test markup", "automatically reset" );
});

test("running test name displayed", function( assert ) {
	expect(2);

	var displaying = document.getElementById("qunit-testresult");

	assert.ok( /running test name displayed/.test(displaying.innerHTML), "Expect test name to be found in displayed text" );
	assert.ok( /fixture/.test(displaying.innerHTML), "Expect module name to be found in displayed text" );
});

(function() {
	var delayNextSetup,
		sleep = function( n ) {
			stop();
			setTimeout( function() { start(); }, n );
		};

	module("timing", {
		setup: function() {
			if ( delayNextSetup ) {
				delayNextSetup = false;
				sleep( 250 );
			}
		}
	});

	test("setup", 0, function() {
		delayNextSetup = true;
	});

	test("basics", 2, function( assert ) {
		var previous = getPreviousTests(/^setup$/, /^timing$/)[0],
			runtime = previous.lastChild.previousSibling;
		assert.ok( /(^| )runtime( |$)/.test( runtime.className ), "Runtime element exists" );
		assert.ok( /^\d+ ms$/.test( runtime.innerHTML ), "Runtime reported in ms" );
	});

	test("values", 2, function( assert ) {
		var basics = getPreviousTests(/^setup$/, /^timing$/)[0],
			slow = getPreviousTests(/^basics$/, /^timing$/)[0];
		assert.ok( parseInt( basics.lastChild.previousSibling.innerHTML, 10 ) < 50, "Fast runtime for trivial test" );
		assert.ok( parseInt( slow.lastChild.previousSibling.innerHTML, 10 ) > 250, "Runtime includes setup" );
	});
})();

}

module("custom assertions");
(function() {
	QUnit.assert.mod2 = function( value, expected, message ) {
		var actual = value % 2;
		QUnit.push(actual === expected, actual, expected, message);
	};
	test("mod2", 2, function( assert ) {
		assert.mod2(2, 0, "2 % 2 == 0");
		assert.mod2(3, 1, "3 % 2 == 1");
	});
})();


module("recursions");

function Wrap(x) {
	this.wrap = x;
	if (x === undefined) {
		this.first = true;
	}
}

function chainwrap(depth, first, prev) {
	depth = depth || 0;
	var last = prev || new Wrap();
	first = first || last;

	if (depth === 1) {
		first.wrap = last;
	}
	if (depth > 1) {
		last = chainwrap(depth-1, first, new Wrap(last));
	}

	return last;
}

test("Check jsDump recursion", function( assert ) {
	expect(4);

	var noref = chainwrap(0);
	var nodump = QUnit.jsDump.parse(noref);
	assert.equal(nodump, '{\n  "first": true,\n  "wrap": undefined\n}');

	var selfref = chainwrap(1);
	var selfdump = QUnit.jsDump.parse(selfref);
	assert.equal(selfdump, '{\n  "first": true,\n  "wrap": recursion(-1)\n}');

	var parentref = chainwrap(2);
	var parentdump = QUnit.jsDump.parse(parentref);
	assert.equal(parentdump, '{\n  "wrap": {\n    "first": true,\n    "wrap": recursion(-2)\n  }\n}');

	var circref = chainwrap(10);
	var circdump = QUnit.jsDump.parse(circref);
	assert.ok(new RegExp("recursion\\(-10\\)").test(circdump), "(" +circdump + ") should show -10 recursion level");
});

test("Check equal/deepEqual recursion", function( assert ) {
	var noRecursion = chainwrap(0);
	assert.equal(noRecursion, noRecursion, "I should be equal to me.");
	assert.deepEqual(noRecursion, noRecursion, "... and so in depth.");

	var selfref = chainwrap(1);
	assert.equal(selfref, selfref, "Even so if I nest myself.");
	assert.deepEqual(selfref, selfref, "... into the depth.");

	var circref = chainwrap(10);
	assert.equal(circref, circref, "Or hide that through some levels of indirection.");
	assert.deepEqual(circref, circref, "... and checked on all levels!");
});


test("Circular reference with arrays", function( assert ) {

	// pure array self-ref
	var arr = [];
	arr.push(arr);

	var arrdump = QUnit.jsDump.parse(arr);

	assert.equal(arrdump, '[\n  recursion(-1)\n]');
	assert.equal(arr, arr[0], 'no endless stack when trying to dump arrays with circular ref');


	// mix obj-arr circular ref
	var obj = {};
	var childarr = [obj];
	obj.childarr = childarr;

	var objdump = QUnit.jsDump.parse(obj);
	var childarrdump = QUnit.jsDump.parse(childarr);

	assert.equal(objdump, '{\n  "childarr": [\n    recursion(-2)\n  ]\n}');
	assert.equal(childarrdump, '[\n  {\n    "childarr": recursion(-2)\n  }\n]');

	assert.equal(obj.childarr, childarr, 'no endless stack when trying to dump array/object mix with circular ref');
	assert.equal(childarr[0], obj, 'no endless stack when trying to dump array/object mix with circular ref');

});


test("Circular reference - test reported by soniciq in #105", function( assert ) {
	var MyObject = function() {};
	MyObject.prototype.parent = function(obj) {
		if (obj === undefined) { return this._parent; }
		this._parent = obj;
	};
	MyObject.prototype.children = function(obj) {
		if (obj === undefined) { return this._children; }
		this._children = obj;
	};

	var a = new MyObject(),
		b = new MyObject();

	var barr = [b];
	a.children(barr);
	b.parent(a);

	assert.equal(a.children(), barr);
	assert.deepEqual(a.children(), [b]);
});

(function() {
	var reset = QUnit.reset;
	module("reset");
	test("reset runs assertions", function( assert ) {
		expect(0);
		QUnit.reset = function() {
			assert.ok( false, "reset should not modify test status" );
			reset.apply( this, arguments );
		};
	});
	test("reset runs assertions, cleanup", function() {
		expect(0);
		QUnit.reset = reset;
	});
})();

function testAfterDone() {
	var testName = "ensure has correct number of assertions";

	function secondAfterDoneTest() {
		QUnit.config.done = [];
		// Because when this does happen, the assertion count parameter doesn't actually
		// work we use this test to check the assertion count.
		module("check previous test's assertion counts");
		test('count previous two test\'s assertions', function ( assert ) {
			var tests = getPreviousTests(/^ensure has correct number of assertions/, /^Synchronous test after load of page$/);

			assert.equal(tests[0].firstChild.lastChild.getElementsByTagName("b")[1].innerHTML, "99");
			assert.equal(tests[1].firstChild.lastChild.getElementsByTagName("b")[1].innerHTML, "99");
		});
	}
	QUnit.config.done = [];
	QUnit.done(secondAfterDoneTest);

	module("Synchronous test after load of page");

	asyncTest('Async test', function( assert ) {
		start();
		for (var i = 1; i < 100; i++) {
			assert.ok(i);
		}
	});

	test(testName, 99, function( assert ) {
		for (var i = 1; i < 100; i++) {
			assert.ok(i);
		}
	});

	// We need two of these types of tests in order to ensure that assertions
	// don't move between tests.
	test(testName + ' 2', 99, function( assert ) {
		for (var i = 1; i < 100; i++) {
			assert.ok(i);
		}
	});


}

if (typeof setTimeout !== 'undefined') {
	QUnit.done(testAfterDone);
}
