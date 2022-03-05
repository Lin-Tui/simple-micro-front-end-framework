export type ObjectType = Record<string, any>;
export type AppProps = {
    name: string;
    singleSpa: any;
};

export type LifeCycleFn = (config?: ObjectType & AppProps) => Promise<any>;

export type LifeCycles = {
    bootstrap?: LifeCycleFn | Array<LifeCycleFn>;
    mount?: LifeCycleFn | Array<LifeCycleFn>;
    unmount?: LifeCycleFn | Array<LifeCycleFn>;
    unload?: LifeCycleFn | Array<LifeCycleFn>;
};

export type AppLoad = LifeCycleFn | LifeCycles;

export type ActivityFn = (location: Location) => boolean;

export type Activity = ActivityFn | string;

export type RegisterApplicationConfig = {
    name: string;
    app: AppLoad;
    activeWhen: Activity;
    customProps: ObjectType;
};

export type StandardRegisterApplicationConfig = {
    name: string;
    loadApp: LifeCycleFn;
    activeWhen: ActivityFn;
    customProps: ObjectType;
};

export type ApplicationInfo = {
    loadErrorTime: any;
    status: string;
};

export type Application = ApplicationInfo &
    StandardRegisterApplicationConfig &
    LifeCycles;

export type AppChanges = {
    appsToLoad: Array<Application>;
    appsToMount: Array<Application>;
    appsToUnmount: Array<Application>;
    appsToUnload: Array<Application>;
};
