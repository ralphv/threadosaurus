import {isMainThread, parentPort, Worker, workerData} from 'worker_threads';
import {extname} from 'path';
import TrackedPromise from './TrackedPromise';
import {Expect} from "./Expect";

const fileExtension = extname(__filename);
const isTypescript = fileExtension === '.ts';

export function CreateThreadosaurus<MethodsInterface extends object>(
    filename: string,
    maxRunTimeMs: number = 0,
) {
    return new Proxy({} as MethodsInterface, {
        get(target: MethodsInterface, p: string, receiver: any): any {
            return (...args: any[]) => {
                return new TrackedPromise((resolve, reject, isSettled) => {
                    let weAreTerminating = false;
                    const worker = new Worker(
                        !isTypescript ? __filename : `require('ts-node').register(); require('${__filename}');`,
                        {
                            workerData: Expect<WorkerDataType>({
                                source: CreateThreadosaurus.name,
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
                                    return;
                                }
                                try {
                                    weAreTerminating = true;
                                    await worker.terminate();
                                } catch (e) {
                                    //ignore
                                }
                                reject(
                                    new CreateThreadosaurusTimeoutError('CreateThreadosaurus execution timed out'),
                                );
                            })();
                        }, maxRunTimeMs);
                    }

                    worker.on('message', (result: { error?: any; output: any }) => {
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

                    worker.on('error', (...args) => {
                        if (weAreTerminating) {
                            return;
                        }
                        reject(...args);
                    });

                    worker.on('exit', (code) => {
                        if (weAreTerminating) {
                            return;
                        }
                        if (code !== 0) {
                            reject(new Error(`Worker stopped with exit code ${code}`));
                        }
                    });
                }, true);
            };
        },
    });
}

if (!isMainThread) {
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

            const module: { default: { new(): any } } = await import(filename);

            const instance = new module.default() as { [key: string]: (...args: any[]) => any };
            const result = await instance[input.p](...input.args);

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

export class CreateThreadosaurusTimeoutError extends Error {
}

type WorkerDataType = { source: string; args: any[]; filename: string; p: string };
