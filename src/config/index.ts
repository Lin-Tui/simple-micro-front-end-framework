
export const AppStatus = {
    // 子应用注册以后的初始状态、注册未加载
    NOT_LOADED: 'NOT_LOADED',
    // 表示正在加载子应用源代码
    LOADING_SOURCE_CODE: 'LOADING_SOURCE_CODE',
    // 执行完 app.loadApp，即子应用加载完以后的状态
    NOT_BOOTSTRAPPED: 'NOT_BOOTSTRAPPED',
    // 正在初始化。生命周期的boostrap只执行一次
    BOOTSTRAPPING: 'BOOTSTRAPPING',
    // 执行 app.bootstrap 之后的状态，表是初始化完成，处于未挂载的状态
    NOT_MOUNTED: 'NOT_MOUNTED',
    // 正在挂载，处于生命周期的mount时期
    MOUNTING: 'MOUNTING',
    // 挂载完成，app.mount 执行完毕
    MOUNTED: 'MOUNTED',
    UPDATING: 'UPDATING',
    // 正在卸载，生命周期中unmount时期
    UNMOUNTING: 'UNMOUNTING',
    // 正在移除，生命周期中unload时期
    UNLOADING: 'UNLOADING',
    // 加载出错
    LOAD_ERROR: 'LOAD_ERROR',
    // 执行期间出错
    SKIP_BECAUSE_BROKEN: 'SKIP_BECAUSE_BROKEN'
}