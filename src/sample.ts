import { CreateThreadosaurus } from './CreateThreadosaurus';
import SampleWorkerThreadClass from './SampleWorkerThreadClass';

void (async () => {
    const worker = await CreateThreadosaurus(SampleWorkerThreadClass);
    worker.greet('LJ and NJ').then(console.log);
})();
