import { Application, LifeCycleFn } from '../interfaces/applications';

export function handleError(error: any, app: Application, status: string) {
    app.status = status;
    console.log('Error:', error);
    throw Error(error);
}

export function isPromise(obj: any): boolean {
    return (
        obj && typeof obj.then === 'function' && typeof obj.catch === 'function'
    );
}

export function isValidLifeCycle(func: any): boolean {
    return func && (typeof func === 'function' || isArrayFn(func));
    function isArrayFn(func: any): boolean {
        return (
            Array.isArray(func) &&
            !func.find(item => typeof item !== 'function')
        );
    }
}

export function flattenFnArray(
    app: Application,
    lifecycleName: 'bootstrap' | 'mount' | 'unmount' | 'unload'
) {
    let funcArray = app[lifecycleName] || [];
    funcArray = Array.isArray(funcArray) ? funcArray : [funcArray];
    if (funcArray.length === 0) {
        funcArray = [() => Promise.resolve()];
    }
    return function (props: any): Promise<any> {
        //  此处使用类型断言
        return (funcArray as Array<LifeCycleFn>).reduce(
            (resultPromise: Promise<any>, curFunc: any, index: number) => {
                return resultPromise.then(() => {
                    const thisPromise = curFunc(props);
                    return isPromise(thisPromise)
                        ? thisPromise
                        : Promise.reject(`${lifecycleName}执行错误！`);
                });
            },
            Promise.resolve()
        );
    };
}
