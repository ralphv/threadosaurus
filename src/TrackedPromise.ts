export default class TrackedPromise<T> extends Promise<T> {
    constructor(
        executor: (
            resolve: (value: T | PromiseLike<T>) => void,
            reject: (reason?: any) => void,
            isSettled: () => boolean,
        ) => void,
        singleCall: boolean = true,
    ) {
        super((_resolve, _reject) => {
            let settled = false;
            executor(
                (value: T | PromiseLike<T>) => {
                    if (singleCall && settled) {
                        return;
                    }
                    settled = true;
                    _resolve(value);
                },
                (reason?: any) => {
                    if (singleCall && settled) {
                        return;
                    }
                    settled = true;
                    _reject(reason);
                },
                () => settled,
            );
        });
    }
}
