import { AppStatus } from '../config/index';
import { Application } from '../interfaces/applications';
import {
    flattenFnArray,
    handleError,
    isPromise,
    isValidLifeCycle
} from '../utils';

export default function loadPromise(app: Application): Promise<any> {
    return Promise.resolve().then((): any => {
        if (
            ![AppStatus.LOAD_ERROR, AppStatus.NOT_LOADED].includes(app.status)
        ) {
            return app;
        }
        app.status = AppStatus.LOADING_SOURCE_CODE;
        let isUserErr = false;
        return Promise.resolve()
            .then(() => {
                const loadApp = app.loadApp();
                if (!isPromise(loadApp)) {
                    isUserErr = true;
                    handleError(
                        '加载函数的返回值不为promise',
                        app,
                        AppStatus.SKIP_BECAUSE_BROKEN
                    );
                }
                return loadApp.then(res => {
                    let errMessage = '';
                    if (typeof res !== 'object') {
                        errMessage = '应用未导出';
                    } else if (isValidLifeCycle(res.bootstrap)) {
                        errMessage = '生命周期函数bootstrap未导出';
                    } else if (isValidLifeCycle(res.mount)) {
                        errMessage = '生命周期函数mount未导出';
                    } else if (isValidLifeCycle(res.unmount)) {
                        errMessage = '生命周期函数unmount未导出';
                    }
                    if (errMessage) {
                        isUserErr = true;
                        handleError(
                            errMessage,
                            app,
                            AppStatus.SKIP_BECAUSE_BROKEN
                        );
                        return app;
                    }
                    app.status = AppStatus.NOT_BOOTSTRAPPED;
                    app.bootstrap = flattenFnArray(res, 'bootstrap');
                    app.mount = flattenFnArray(res, 'mount');
                    app.unmount = flattenFnArray(res, 'unmount');
                    app.unload = flattenFnArray(res, 'unload');
                    return app;
                });
            })
            .catch(err => {
                let newStatus = '';
                if (isUserErr) {
                    newStatus = AppStatus.SKIP_BECAUSE_BROKEN;
                } else {
                    newStatus = AppStatus.LOAD_ERROR;
                    app.loadErrorTime = new Date().getTime();
                }
                handleError(err, app, newStatus);
                return app;
            });
    });
}
