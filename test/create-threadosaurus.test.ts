import {expect} from 'chai';
import { CreateThreadosaurus } from '../src';
import SampleClass from './SampleClass';
import SampleClassMissingAdd from './SampleClassMissingAdd';

describe('CreateThreadosaurus', () => {
    it('test addObject', async () => {
        const worker = CreateThreadosaurus(new SampleClass());
        const result = await worker.addObject({ a: 1, b: 2 });
        expect(result).to.equal(3);
    });
    it('test noArgs', async () => {
        const worker = CreateThreadosaurus(new SampleClass());
        const result = await worker.noArgs();
        expect(result).to.equal(11);
    });
    it('test greet', async () => {
        const worker = CreateThreadosaurus(new SampleClass());
        const result = await worker.greet('Threadosaurus');
        expect(result).to.equal('Hello Threadosaurus');
    });
    it('test add', async () => {
        const worker = CreateThreadosaurus(new SampleClass());
        const result = await worker.add(1, 2);
        expect(result).to.equal(3);
    });
    it('test error', async () => {
        const worker = CreateThreadosaurus(new SampleClass());
        try {
            await worker.error();
            expect.fail(`this should fail`);
        } catch (e) {
            expect(String(e)).to.equal('Error: This is an exception');
        }
    });
    it('test timeout', async () => {
        const worker = CreateThreadosaurus(new SampleClass(), 100);
        try {
            await worker.long();
            expect.fail(`this should fail`);
        } catch (e) {
            expect(String(e)).to.equal('Error: CreateThreadosaurus execution timed out');
        }
    });
    it('test missing get__filename', async () => {
        try {
            const worker = CreateThreadosaurus({} as SampleClass);
            await worker.add(1, 2);
            expect.fail(`this should fail`);
        } catch (e) {
            expect(String(e)).to.equal("Error: method: 'get__filename' not found on class 'Object'");
        }
    });
    it('test missing method', async () => {
        try {
            const worker = CreateThreadosaurus(new SampleClassMissingAdd() as SampleClass);
            await worker.add(1, 2);
            expect.fail(`this should fail`);
        } catch (e) {
            expect(String(e)).to.equal("Error: method: 'add' not found on class 'SampleClassMissingAdd'");
        }
    });
});