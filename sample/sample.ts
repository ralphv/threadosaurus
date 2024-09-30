import SampleWorkerThreadClass from './SampleWorkerThreadClass';
import { CreateThreadosaurus } from '../src';

void (async () => {
    const worker = CreateThreadosaurus(SampleWorkerThreadClass);
    worker.greet('LJ and NJ').then(console.log);
})();
