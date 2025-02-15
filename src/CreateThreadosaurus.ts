import { isMainThread, parentPort, Worker, workerData } from 'worker_threads';
import { extname } from 'path';
import TrackedPromise from './TrackedPromise';
import { Expect } from './Expect';

const FORCE_EXIT_MESSAGE = 'force_exit';

export function CreateThreadosaurus<T extends Threadosaurus>(
    ClassRef: new (...args: unknown[]) => T,
    maxRunTimeMs: number = 0,
    forceTerminate: boolean = false,
) {
    const instance = new ClassRef();
    if (typeof instance.get__filename !== 'function') {
        throw new ThreadosaurusError(`method: 'get__filename' not found on class '${instance.constructor.name}'`);
    }
    const filename = instance.get__filename();
    const isWorkerTypescript = extname(filename) === '.ts';
    return new Proxy({} as T, {
        get(target: T, p: string): unknown {
            return (...args: unknown[]) => {
                return new TrackedPromise((resolve, reject, isSettled) => {
                    let weAreTerminating = false;
                    const worker = new Worker(
                        isWorkerTypescript
                            ? `if (typeof Bun === "undefined") {require('ts-node').register();} require('${__filename}');`
                            : __filename,
                        {
                            workerData: Expect<WorkerDataType>({
                                source: CreateThreadosaurus.name,
                                className: instance.constructor.name,
                                args,
                                filename,
                                p,
                            }),
                            eval: isWorkerTypescript,
                        },
                    );

                    let timeoutId: NodeJS.Timeout | undefined;
                    if (maxRunTimeMs !== 0) {
                        timeoutId = setTimeout(() => {
                            void (async () => {
                                /* istanbul ignore next */
                                if (isSettled()) {
                                    return;
                                }
                                try {
                                    weAreTerminating = true;
                                    if (forceTerminate) {
                                        worker.postMessage(FORCE_EXIT_MESSAGE);
                                    }
                                    await worker.terminate();
                                } catch {
                                    //ignore
                                }
                                reject(new ThreadosaurusTimeoutError('CreateThreadosaurus execution timed out'));
                            })();
                        }, maxRunTimeMs);
                    }

                    worker.on('message', (result: { error?: unknown; output: unknown }) => {
                        /* istanbul ignore next */
                        if (weAreTerminating) {
                            return;
                        }
                        clearTimeout(timeoutId); // clear timeout when we are done
                        if (result.error) {
                            reject(result.error);
                        } else {
                            resolve(result.output);
                        }
                    });

                    // in case the code in worker thread prematurely calls process.exit
                    worker.on('exit', (code) => {
                        if (weAreTerminating) {
                            return;
                        }
                        reject(new ThreadosaurusError(`Worker stopped with exit code ${code}`));
                    });
                }, true);
            };
        },
    });
}

/* istanbul ignore next */
if (!isMainThread) {
    void (async () => {
        const fileExtension = extname(__filename);
        const isThisTypescript = fileExtension === '.ts';

        try {
            const input: WorkerDataType = workerData;
            if (input.source !== CreateThreadosaurus.name) {
                // this is not intended for this class
                return;
            }
            parentPort?.on('message', (message: string) => {
                if (message === FORCE_EXIT_MESSAGE) {
                    process.exit(-1);
                }
            });

            let filename = input.filename;

            if (!extname(filename)) {
                filename = filename + (isThisTypescript ? '.ts' : '.js');
            }

            const module: { default: { new (): unknown } } = await import(filename);
            if (!module.default || module.default.name !== input.className) {
                throw new ThreadosaurusError('The worker class must be the default export');
            }

            const instance = new module.default() as { [key: string]: (...args: unknown[]) => unknown };
            if (typeof instance[input.p] !== 'function') {
                throw new ThreadosaurusError(`method: '${input.p}' not found on class '${input.className}'`);
            }
            const resultPromise = instance[input.p](...input.args);
            if (!(resultPromise instanceof Promise)) {
                throw new ThreadosaurusError(`All methods on class '${input.className}' should be async`);
            }
            const result = await resultPromise;

            parentPort?.postMessage({
                output: result,
            });
        } catch (error) {
            parentPort?.postMessage({
                output: undefined,
                error,
            });
        }
    })();
}

export class ThreadosaurusError extends Error {}

export class ThreadosaurusTimeoutError extends Error {}

type WorkerDataType = { source: string; className: string; args: unknown[]; filename: string; p: string };

export interface Threadosaurus {
    get__filename(): string;
}
