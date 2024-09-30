# threadosaurus

[![npm version](https://img.shields.io/npm/v/threadosaurus)](https://www.npmjs.com/package/threadosaurus)
[![Build Status](https://img.shields.io/github/actions/workflow/status/ralphv/threadosaurus/ci.yml?branch=main)](https://github.com/ralphv/threadosaurus/actions)

A simple and intuitive way to utilize worker threads in Node.js with TypeScript.

## install

```sh
npm i threadosaurus
```

## Usage

Here's a quick example of how to use Threadosaurus:
```typescript
import { CreateThreadosaurus, Threadosaurus } from 'threadosaurus';

class SampleWorkerThreadClass implements Threadosaurus {
    async greet(name: string): Promise<string> {
        return Promise.resolve(`Hello ${name} from worker thread!`);
    }
}

const worker = await CreateThreadosaurus(SampleWorkerThreadClass);
console.log(await worker.greet('LJ and NJ'));
```

## Restrictions

When using Threadosaurus, please keep the following limitations in mind:

* The worker class must implement the **Threadosaurus interface**.
* The worker class be **the default export**.
* The worker class **cannot accept constructor arguments**.
* The worker class will **not retain member variables** across method calls from the main thread.
* All methods in the worker class **must be asynchronous**.
* All method arguments in the worker class **must be basic types**, complex types cannot be passed to the worker.
* It is recommended to design your class methods as **pure functions** for better predictability.

## License

MIT