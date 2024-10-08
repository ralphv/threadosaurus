import { type Threadosaurus } from '../src';

export default class SampleClassMissingAdd implements Threadosaurus {
    async addObject(args: { a: number; b: number }): Promise<number> {
        return Promise.resolve(args.a + args.b);
    }

    async noArgs(): Promise<number> {
        return Promise.resolve(11);
    }

    async greet(name: string): Promise<string> {
        return Promise.resolve(`Hello ${name}`);
    }

    error(): Promise<void> {
        return Promise.reject(new Error('This is an exception'));
    }

    long(): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, 1000));
    }

    get__filename(): string {
        return __filename;
    }
}
