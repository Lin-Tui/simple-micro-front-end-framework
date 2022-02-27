import { getAppChanges, isStarted } from '../applications/app';
import { Application } from '../interfaces/applications';

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
        executeApps(appsToChange);
    } else {
        appsToChange = appsToLoad;
        loadApps(appsToChange);
    }
}

function loadApps(apps: Array<Application>) {}

function executeApps(apps: Array<Application>) {}
