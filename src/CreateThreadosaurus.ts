import { isMainThread, parentPort, Worker, workerData } from 'worker_threads';
import { extname } from 'path';
import TrackedPromise from './TrackedPromise';
import { Expect } from './Expect';

const fileExtension = extname(__filename);
const isTypescript = fileExtension === '.ts';

export function CreateThreadosaurus<T extends Threadosaurus>(
    ClassRef: new (...args: any[]) => T,
    maxRunTimeMs: number = 0,
) {
    const instance = new ClassRef();
    if (!instance.get__filename) {
        throw new ThreadosaurusError(`method: 'get__filename' not found on class '${instance.constructor.name}'`);
    }
    const filename = instance.get__filename();
    return new Proxy({} as T, {
        get(target: T, p: string, receiver: any): any {
            return (...args: any[]) => {
                return new TrackedPromise((resolve, reject, isSettled) => {
                    let weAreTerminating = false;
                    const worker = new Worker(
                        !isTypescript ? __filename : `require('ts-node').register(); require('${__filename}');`,
                        {
                            workerData: Expect<WorkerDataType>({
                                source: CreateThreadosaurus.name,
                                className: instance.constructor.name,
                                args,
                                filename,
                                p,
                            }),
                            eval: isTypescript,
                        },
                    );

                    let timeoutId: NodeJS.Timeout | undefined;
                    if (maxRunTimeMs !== 0) {
                        timeoutId = setTimeout(() => {
                            void (async () => {
                                if (isSettled()) {
                                    /* istanbul ignore next */
                                    return;
                                }
                                try {
                                    weAreTerminating = true;
                                    await worker.terminate();
                                } catch (e) {
                                    //ignore
                                }
                                reject(new ThreadosaurusError('CreateThreadosaurus execution timed out'));
                            })();
                        }, maxRunTimeMs);
                    }

                    worker.on('message', (result: { error?: any; output: any }) => {
                        if (weAreTerminating) {
                            /* istanbul ignore next */
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
    /* istanbul ignore next */
    void (async () => {
        try {
            const input: WorkerDataType = workerData;
            if (input.source !== CreateThreadosaurus.name) {
                // this is not intended for this class
                return;
            }
            let filename = input.filename;

            if (!extname(filename)) {
                filename = filename + (isTypescript ? '.ts' : '.js');
            }

            const module: { default: { new (): any } } = await import(filename);

            const instance = new module.default() as { [key: string]: (...args: any[]) => any };
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

type WorkerDataType = { source: string; className: string; args: any[]; filename: string; p: string };

export interface Threadosaurus {
    get__filename(): string;
}
