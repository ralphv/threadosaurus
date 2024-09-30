import { CreateThreadosaurus } from '../src';
import SampleClass from './SampleClass';
import SampleClassMissingAdd from './SampleClassMissingAdd';

describe('CreateThreadosaurus', () => {
    it('test addObject', async () => {
        const worker = CreateThreadosaurus(new SampleClass());
        const result = await worker.addObject({ a: 1, b: 2 });
        expect(result).toEqual(3);
    });
    it('test noArgs', async () => {
        const worker = CreateThreadosaurus(new SampleClass());
        const result = await worker.noArgs();
        expect(result).toEqual(11);
    });
    it('test greet', async () => {
        const worker = CreateThreadosaurus(new SampleClass());
        const result = await worker.greet('Threadosaurus');
        expect(result).toEqual('Hello Threadosaurus');
    });
    it('test add', async () => {
        const worker = CreateThreadosaurus(new SampleClass());
        const result = await worker.add(1, 2);
        expect(result).toEqual(3);
    });
    it('test error', async () => {
        const worker = CreateThreadosaurus(new SampleClass());
        try {
            await worker.error();
            fail(`this should fail`);
        } catch (e) {
            expect(String(e)).toEqual('Error: This is an exception');
        }
    });
    it('test timeout', async () => {
        const worker = CreateThreadosaurus(new SampleClass(), 100);
        try {
            await worker.long();
            fail(`this should fail`);
        } catch (e) {
            expect(String(e)).toEqual('Error: CreateThreadosaurus execution timed out');
        }
    });
    it('test missing get__filename', async () => {
        try {
            const worker = CreateThreadosaurus({} as SampleClass);
            await worker.add(1, 2);
            fail(`this should fail`);
        } catch (e) {
            expect(String(e)).toEqual("Error: method: 'get__filename' not found on class 'Object'");
        }
    });
    it('test missing method', async () => {
        try {
            const worker = CreateThreadosaurus(new SampleClassMissingAdd() as SampleClass);
            await worker.add(1, 2);
            fail(`this should fail`);
        } catch (e) {
            expect(String(e)).toEqual("Error: method: 'add' not found on class 'SampleClassMissingAdd'");
        }
    });
});