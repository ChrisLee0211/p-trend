import * as example from '../src/index';

describe(`测试`,() => {
    it(`example` , () => {
        expect(example.initExample()).toEqual(`example`);
        expect(example.printStr(example.initExample())).toEqual(['example'])
    })
})