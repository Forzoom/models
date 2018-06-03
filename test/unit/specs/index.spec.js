function Test(data) {
	Schema.call(this, Test._model, data);
	this._name = Test.name;
}
Test.prototype = Schema.prototype;
Test._model = {
	key1: { type: 'String', default: 'defaultValue', },
	key2: { type: 'String?', },
	fooBar: { type: 'String' },
	arr: { type: 'Array', default: function() { return []; }, },
};

describe('#Schema', function() {
	it('#basic', function() {
		var test = new Test();

		expect(test.key1).to.equal('defaultValue');
		expect(test.key2).to.be.null;

		test.foo_bar = 'foo_bar';
		expect(test.fooBar).to.equal('foo_bar');
		test.fooBar = 'fooBar';
		expect(test.fooBar).to.equal('fooBar');
		expect(test.foo_bar).to.equal('fooBar');

		test.inflate({
			key1: 'key1',
			foo_bar: 'foo_bar',
		});
		expect(test.key1).to.equal('key1');
		expect(test.foo_bar).to.equal('foo_bar');
		expect(test.fooBar).to.equal('foo_bar');

		test.registerProperty('foo', {
			type: 'Number',
			default: 10,
		});
		expect(test.foo).to.equal(10);

		var vm = new Vue({
			data: function data() {
				return {
					test: test,
				};
			},
			computed: {
				computedValue: function computedValue() {
					return this.test.fooBar;
				},
			},
		});

		expect(vm.test.foo_bar).to.equal('foo_bar');
		expect(vm.computedValue).to.equal('foo_bar');
		vm.test.fooBar = 'value';
		expect(vm.computedValue).to.equal('value');
	});

	it('#getSnake()', function() {
		var test = new Test();
		var snake = test.getSnake();
		var camel = test.getCamel();

		expect(Object.keys(snake).length).to.equal(4);
		expect(snake.key_1).to.equal('defaultValue');
		expect(snake.key_2).to.be.null;
		expect(snake.foo_bar).to.null;

		expect(Object.keys(camel).length).to.equal(4);
		expect(camel.key1).to.equal('defaultValue');
		expect(camel.key2).to.be.null;
		expect(camel.fooBar).to.be.null;
	});

	it('#equal()', function() {
		var a = new Test();
		var b = new Test();

		expect(a.equal(b)).to.be.true;

		b.key1 = 'test';
		expect(a.equal(b)).to.be.false;

		a.key1 = 'test';
		expect(a.equal(b)).to.be.true;

		a.arr.push('test');
		expect(a.equal(b)).to.be.false;

		b.arr.push('test1');
		expect(a.equal(b)).to.be.false;

		a.arr.push('test1');
		b.arr.push('test');
		expect(a.equal(b)).to.be.true;
	});
});