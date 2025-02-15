import { type Threadosaurus } from '../src';

export default class SampleClass implements Threadosaurus {
    async addObject(args: { a: number; b: number }): Promise<number> {
        return Promise.resolve(args.a + args.b);
    }

    async noArgs(): Promise<number> {
        return Promise.resolve(11);
    }

    async greet(name: string): Promise<string> {
        return Promise.resolve(`Hello ${name}`);
    }

    async add(a: number, b: number): Promise<number> {
        return Promise.resolve(a + b);
    }

    error(): Promise<void> {
        return Promise.reject(new Error('This is an exception'));
    }

    long(): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, 1000));
    }

    infinite(): Promise<void> {
        while (true) {
            /* empty */
        }
    }

    async exit(code: number): Promise<void> {
        process.exit(code);
    }

    async nonBasicArguments(a: unknown): Promise<unknown> {
        return Promise.resolve(a);
    }

    get__filename(): string {
        return __filename;
    }
}
