
describe('#util', function() {
    it('#arrayEqual', function() {
        var arr1 = ['1'];
        var arr2 = ['1'];

        expect(Schema.utils.arrayEqual(arr1, arr2)).to.be.true;

        arr2.push('2');
        expect(Schema.utils.arrayEqual(arr1, arr2)).to.be.false;
    });
});