import { CreateThreadosaurus } from './CreateThreadosaurus';
import SampleWorkerThreadClass from './SampleWorkerThreadClass';

void (async () => {
    const worker = CreateThreadosaurus(SampleWorkerThreadClass);
    worker.greet('LJ and NJ').then(console.log);
})();
