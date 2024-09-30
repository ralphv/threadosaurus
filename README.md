# threadosaurus

[![npm version](https://img.shields.io/npm/v/threadosaurus)](https://www.npmjs.com/package/threadosaurus)
[![Build Status](https://img.shields.io/github/actions/workflow/status/ralphv/threadosaurus/ci.yml?branch=main)](https://github.com/ralphv/threadosaurus/actions)

A super easy way to use worker threads in Node.js with TypeScript

## install

```sh
npm i threadosaurus
```

## Usage

```typescript
import { CreateThreadosaurus } from 'threadosaurus';

class SampleWorkerThreadClass implements Threadosaurus {
    async greet(name: string): Promise<string> {
        return Promise.resolve(`Hello ${name} from worker thread!`);
    }
}

const worker = CreateThreadosaurus(SampleWorkerThreadClass);
console.log(await worker.greet('LJ and NJ'));
```

## Restrictions

* The worker class should implement interface `Threadosaurus`.
* The worker class can not have `constructor arguments`.
* The worker class will `not retain member variables` across main thread method calls.
* All methods on the worker class `should be async`.
* All arguments on methods on the worker class `should be basic types`.
* It's best to design your class methods as pure functions.

## License

MIT