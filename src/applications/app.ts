import { AppStatus } from '../config';
import {
    RegisterApplicationConfig,
    ActivityFn,
    Activity,
    Application,
    AppLoad,
    LifeCycleFn,
    AppChanges
} from '../interfaces/applications';
import { reroute } from '../navigation/reroute';
import { handleError } from '../utils/index';
const apps: Array<Application> = [];

let started = false;

export function getAppsName(): Array<string> {
    return apps.map(item => item.name);
}

export function registerApplication(config: RegisterApplicationConfig): void {
    const registerConfig: Application = {
        name: '',
        loadApp: () => Promise.resolve(),
        activeWhen: () => false,
        customProps: {},
        status: AppStatus.NOT_LOADED,
        loadErrorTime: null
    };
    registerConfig.name = config.name;
    if (getAppsName().includes(config.name)) {
        handleError(
            '该应用已存在，请勿重复注册！',
            registerConfig,
            AppStatus.SKIP_BECAUSE_BROKEN
        );
        return;
    }
    registerConfig.customProps = config.customProps;
    registerConfig.activeWhen = sanitizeActiveWhen(config.activeWhen);
    registerConfig.loadApp = sanitizeApp(config.app);
    apps.push(registerConfig);
    reroute();
}

export function getAppChanges(): AppChanges {
    const appsToLoad: Array<Application> = [],
        appsToMount: Array<Application> = [],
        appsToUnmount: Array<Application> = [],
        appsToUnload: Array<Application> = [];
    apps.forEach(app => {
        const currentTime = new Date().getTime();
        const appShouldActive =
            app.status !== AppStatus.SKIP_BECAUSE_BROKEN && shouldActive(app);
        switch (app.status) {
            case AppStatus.NOT_LOADED:
            case AppStatus.LOADING_SOURCE_CODE:
                if (appShouldActive) appsToLoad.push(app);
                break;
            case AppStatus.LOAD_ERROR:
                if (appShouldActive && currentTime - app.loadErrorTime >= 200)
                    appsToLoad.push(app);
                break;
            case AppStatus.NOT_MOUNTED:
                if (appShouldActive) appsToMount.push(app);
                break;
            case AppStatus.MOUNTED:
                if (!appShouldActive) appsToUnmount.push(app);
                break;
            case AppStatus.NOT_BOOTSTRAPPED:
            case AppStatus.NOT_MOUNTED:
                if (!appShouldActive) appsToUnload.push(app);
                break;
            // 其他状态将被忽略
        }
    });
    return {
        appsToLoad,
        appsToMount,
        appsToUnmount,
        appsToUnload
    };
}

export function start() {
    started = true;
    reroute();
}

export function isStarted() {
    return Boolean(started);
}

function shouldActive(app: Application): boolean {
    try {
        return app.activeWhen(window.location);
    } catch (err) {
        handleError(err, app, AppStatus.SKIP_BECAUSE_BROKEN);
        return false;
    }
}

function sanitizeApp(app: AppLoad): LifeCycleFn {
    return typeof app === 'function' ? app : () => Promise.resolve(app);
}

function sanitizeActiveWhen(activeWhen: Activity): ActivityFn {
    const activenWhenArray: Array<Activity> = Array.isArray(activeWhen)
        ? activeWhen
        : [activeWhen];

    const activeWhenFunsArray: Array<ActivityFn> = activenWhenArray.map(
        activeWhenItem => {
            return typeof activeWhenItem === 'function'
                ? activeWhenItem
                : pathToActiveWhen(activeWhenItem);
        }
    );

    return location => {
        return activeWhenFunsArray.some(activeWhenFunsItem => {
            activeWhenFunsItem(location);
        });
    };
}
function toDynamticPathValidatorRegex(
    path: string,
    exactMatch?: boolean
): RegExp {
    let lastIndex = 0,
        inDynamic = false,
        regexStr = '^';

    if (path[0] !== '/') {
        path = '/' + path;
    }

    for (let charIndex = 0; charIndex < path.length; charIndex++) {
        const char = path[charIndex];
        const startOfDynamic = !inDynamic && char === ':';
        const endOfDynamic = inDynamic && char === '/';
        if (startOfDynamic || endOfDynamic) {
            appendToRegex(charIndex);
        }
    }

    appendToRegex(path.length);
    return new RegExp(regexStr, 'i');

    function appendToRegex(index: number) {
        const anyCharMaybeTrailingSlashRegex = '[^/]+/?';
        const commonStringSubPath = escapeStrRegex(
            path.slice(lastIndex, index)
        );

        regexStr += inDynamic
            ? anyCharMaybeTrailingSlashRegex
            : commonStringSubPath;

        if (index === path.length) {
            if (inDynamic) {
                if (exactMatch) {
                    // Ensure exact match paths that end in a dynamic portion don't match
                    // urls with characters after a slash after the dynamic portion.
                    regexStr += '$';
                }
            } else {
                // For exact matches, expect no more characters. Otherwise, allow
                // any characters.
                const suffix = exactMatch ? '' : '.*';

                regexStr =
                    // use charAt instead as we could not use es6 method endsWith
                    regexStr.charAt(regexStr.length - 1) === '/'
                        ? `${regexStr}${suffix}$`
                        : `${regexStr}(/${suffix})?(#.*)?$`;
            }
        }

        inDynamic = !inDynamic;
        lastIndex = index;
    }

    function escapeStrRegex(str: string) {
        // borrowed from https://github.com/sindresorhus/escape-string-regexp/blob/master/index.js
        return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    }
}
function pathToActiveWhen(activeWhen: string): ActivityFn {
    const regex = toDynamticPathValidatorRegex(activeWhen);
    return location => {
        let origin = location.origin;
        if (!origin) {
            origin = `${location.protocol}//${location.host}`;
        }
        const route = location.href
            .replace(origin, '')
            .replace(location.search, '')
            .split('?')[0];
        return regex.test(route);
    };
}
