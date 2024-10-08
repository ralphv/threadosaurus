# threadosaurus

[![npm version](https://img.shields.io/npm/v/threadosaurus)](https://www.npmjs.com/package/threadosaurus)
[![Build Status](https://img.shields.io/github/actions/workflow/status/ralphv/threadosaurus/build.yml?branch=main)](https://github.com/ralphv/threadosaurus/actions)
[![codecov](https://codecov.io/gh/ralphv/threadosaurus/branch/main/graph/badge.svg)](https://codecov.io/gh/ralphv/threadosaurus)

<p align="center">
    <a href="https://www.npmjs.com/package/threadosaurus">
      <img src="https://raw.githubusercontent.com/ralphv/threadosaurus/main/resources/threadosaurus-mini.png" alt="Logo">
    </a>
    <h3 align="center">Threadosaurus</h3>
    <p align="center">
        A simple and intuitive way to utilize worker threads in Node.js with TypeScript.
    </p>
</p>

## install

```sh
npm i threadosaurus
```

## Usage

Here's a quick example of how to use Threadosaurus:
```typescript
import { CreateThreadosaurus } from 'threadosaurus';
import SampleWorkerThreadClass from './SampleWorkerThreadClass';

const worker = CreateThreadosaurus(SampleWorkerThreadClass);
console.log(await worker.greet('LJ and NJ'));
```

In `SampleWorkerThreadClass.ts`:

```typescript
import { Threadosaurus } from 'threadosaurus';

export default class SampleWorkerThreadClass implements Threadosaurus {
    async greet(name: string): Promise<string> {
        return Promise.resolve(`Hello ${name} from worker thread!`);
    }

    get__filename(): string {
        return __filename;
    }
}
```

## Restrictions

When using Threadosaurus, please keep the following limitations in mind:

* The worker class must implement the **Threadosaurus interface**.
* The worker class must be **the default export**.
* The worker class **cannot accept constructor arguments**.
* The worker class will **not retain member variables** across method calls from the main thread.
* All methods in the worker class **must be asynchronous**.
* All method arguments in the worker class **must be worker threads compatible types**.
  [More here](https://nodejs.org/api/worker_threads.html).
* It is recommended to design your class methods as **pure functions** for better predictability.

## License

MIT