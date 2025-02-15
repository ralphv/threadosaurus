import { CreateThreadosaurus } from '../src';
import SampleClass from './SampleClass';
import SampleClassMissingAdd from './SampleClassMissingAdd';
import { SampleClassNotDefault } from './SampleClassNotDefault';

jest.setTimeout(10000);

describe('CreateThreadosaurus', () => {
    it('test addObject', async () => {
        const worker = CreateThreadosaurus(SampleClass);
        const result = await worker.addObject({ a: 1, b: 2 });
        expect(result).toEqual(3);
    });
    it('test noArgs', async () => {
        const worker = CreateThreadosaurus(SampleClass);
        const result = await worker.noArgs();
        expect(result).toEqual(11);
    });
    it('test greet', async () => {
        const worker = CreateThreadosaurus(SampleClass);
        const result = await worker.greet('Threadosaurus');
        expect(result).toEqual('Hello Threadosaurus');
    });
    it('test add', async () => {
        const worker = CreateThreadosaurus(SampleClass);
        const result = await worker.add(1, 2);
        expect(result).toEqual(3);
    });
    it('test error', async () => {
        const worker = CreateThreadosaurus(SampleClass);
        try {
            await worker.error();
            fail('this should fail');
        } catch (e) {
            expect(String(e)).toEqual('Error: This is an exception');
        }
    });
    it('test timeout', async () => {
        const worker = CreateThreadosaurus(SampleClass, 100);
        try {
            await worker.long();
            fail('this should fail');
        } catch (e) {
            expect(String(e)).toEqual('Error: CreateThreadosaurus execution timed out');
        }
    });
    it('test timeout with forced terminate', async () => {
        const worker = CreateThreadosaurus(SampleClass, 100, true);
        try {
            await worker.infinite();
            fail('this should fail');
        } catch (e) {
            expect(String(e)).toEqual('Error: CreateThreadosaurus execution timed out');
        }
    });
    it('test missing get__filename', async () => {
        try {
            class AnyClass {}

            // @ts-expect-error force for test
            const worker = CreateThreadosaurus(AnyClass) as SampleClass;
            await worker.add(1, 2);
            fail('this should fail');
        } catch (e) {
            expect(String(e)).toEqual(`Error: method: 'get__filename' not found on class 'AnyClass'`);
        }
    });
    it('test missing method', async () => {
        try {
            const worker = CreateThreadosaurus(SampleClassMissingAdd) as SampleClass;
            await worker.add(1, 2);
            fail('this should fail');
        } catch (e) {
            expect(String(e)).toEqual(`Error: method: 'add' not found on class 'SampleClassMissingAdd'`);
        }
    });
    it('test exit(0)', async () => {
        const worker = CreateThreadosaurus(SampleClass);
        try {
            await worker.exit(0);
            fail('this should fail');
        } catch (e) {
            expect(String(e)).toEqual('Error: Worker stopped with exit code 0');
        }
    });
    it('test exit(1)', async () => {
        const worker = CreateThreadosaurus(SampleClass);
        try {
            await worker.exit(1);
            fail('this should fail');
        } catch (e) {
            expect(String(e)).toEqual('Error: Worker stopped with exit code 1');
        }
    });
    it('test non basic arguments', async () => {
        const worker = CreateThreadosaurus(SampleClass);
        try {
            await worker.nonBasicArguments(jest);
            fail('this should fail');
        } catch (e) {
            expect(String(e)).toContain('DataCloneError:');
        }
    });
    it('test not default export', async () => {
        const worker = CreateThreadosaurus(SampleClassNotDefault);
        try {
            await worker.add(1, 2);
            fail('this should fail');
        } catch (e) {
            expect(String(e)).toContain('Error: The worker class must be the default export');
        }
    });
});
