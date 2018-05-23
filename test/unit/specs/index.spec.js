function Test(data) {
	Schema.call(this, Test._model, data);
	this._name = Test.name;
}
Test.prototype = Schema.prototype;
Test._model = {
	key1: { type: 'String', default: 'defaultValue', },
	key2: { type: 'String?', },
	fooBar: { type: 'String' },
};

describe('#test', function() {
	it('#basic', function() {
		const test = new Test();

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
	});
});