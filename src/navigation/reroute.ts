import { getAppChanges, isStarted } from '../applications/app';
import { Application } from '../interfaces/applications';
import loadPromise from '../lifecycles/load';

export function reroute() {
    const { appsToLoad, appsToMount, appsToUnmount, appsToUnload } =
        getAppChanges();
    let appsToChange: Array<Application>;
    if (isStarted()) {
        appsToChange = [
            ...appsToLoad,
            ...appsToMount,
            ...appsToUnmount,
            ...appsToUnload
        ];
        return executeApps(appsToChange);
    } else {
        appsToChange = appsToLoad;
        return loadApps(appsToChange);
    }
}

function loadApps(apps: Array<Application>) {
    return Promise.resolve().then(() => {
        const toLoadPromise = apps.map(loadPromise);
        return Promise.all(toLoadPromise).catch(err => {
            throw new Error(err);
        });
    });
}

function executeApps(apps: Array<Application>) {}
