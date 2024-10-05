import { type Threadosaurus } from '../src';

export class SampleClassNotDefault implements Threadosaurus {
    async add(a: number, b: number): Promise<number> {
        return Promise.resolve(a + b);
    }

    get__filename(): string {
        return __filename;
    }
}
