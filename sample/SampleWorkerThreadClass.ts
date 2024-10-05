import { type Threadosaurus } from '../src';

export default class SampleWorkerThreadClass implements Threadosaurus {
    async greet(name: string): Promise<string> {
        return Promise.resolve(`Hello ${name} from worker thread!`);
    }

    get__filename(): string {
        return __filename;
    }
}
