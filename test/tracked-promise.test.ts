import { expect } from 'chai';
import { CreateThreadosaurus } from '../src';
import SampleClass from './SampleClass';
import SampleClassMissingAdd from './SampleClassMissingAdd';
import TrackedPromise from '../src/TrackedPromise';

describe('TrackedPromise', () => {
    it('test calling resolve twice', async () => {
        const result = await new TrackedPromise((resolve, reject, isSettled) => {
            resolve(1);
            resolve(2);
            isSettled();
        });
        expect(result).to.equal(1);
    });
    it('test calling reject twice', async () => {
        try {
            await new TrackedPromise((resolve, reject) => {
                reject(new Error('failed'));
                reject(new Error('failed 1'));
            });
            expect.fail(`this should fail`);
        } catch (e) {
            expect(String(e)).to.equal('Error: failed');
        }
    });
});
