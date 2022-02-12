
export type ObjectType = Record<string, any>;
export type AppProps = {
    name: string;
    singleSpa: any;
};

export type LifeCycleFn = (config: ObjectType & AppProps) => Promise<any>;

export type LifeCycles = {
    bootstrap: LifeCycleFn | Array<LifeCycleFn>;
    mount: LifeCycleFn | Array<LifeCycleFn>;
    unmount: LifeCycleFn | Array<LifeCycleFn>;
}

export type AppLoad = LifeCycleFn | LifeCycles;

export type ActivityFn = (location: Location)=> boolean;
 
export type Activity = ActivityFn | string;

export type RegisterApplicationConfig = {
    name: string;
    app: AppLoad;
    activeWhen: Activity;
    customProps: ObjectType; 
}

export type StandardRegisterApplicationConfig = {
    name: string;
    app: LifeCycleFn;
    activeWhen: ActivityFn;
    customProps: ObjectType;
}

export type Status = 
| "NOT_LOADED"
| "LOADING_SOURCE_CODE"
| "NOT_BOOTSTRAPPED"
| "BOOTSTRAPPING"
| "NOT_MOUNTED"
| "MOUNTING"
| "MOUNTED"
| "UNMOUNTING"
| "UNLOADING"
| "LOAD_ERROR"
| "SKIP_BECAUSE_BROKEN";

export type ApplicationInfo = {
    loadErrorTime: any;
    status: Status;
}

export type Application = ApplicationInfo & StandardRegisterApplicationConfig;

export type AppChanges = {
    appsToLoad: Array<Application>;
    appsToMount: Array<Application>;
    appsToUnmount: Array<Application>;
    appsToUnload: Array<Application>;
}