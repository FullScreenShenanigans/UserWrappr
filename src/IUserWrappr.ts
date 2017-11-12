/**
 * 
 */
export enum LoadingStatus {
    Complete,
    InProgress,
    NotStarted
}

export interface ILoadMeasurement {
    timeSpent: number;
}

export interface IInitializationStatus extends ILoadMeasurement {
    loadingStatus: LoadingStatus;
}

/**
 * 
 */
export type ILoadResult<TResult = void> = IFailedLoad | ISuccessfulLoad<TResult>;

/**
 * 
 */
export interface IFailedLoad extends ILoadMeasurement {
    error: any;
    succeeded: false;
}

/**
 * 
 */
export interface ISuccessfulLoad<TResult> extends ILoadMeasurement {
    result: TResult;
    succeeded: true;
}

/**
 * Settings to initialize a new IUserWrappr.
 */
export interface IUserWrapprSettings {
    loadLibraries(): Promise<ILoadResult>;
}

/**
 * Creates configurable HTML displays over GameStartr games.
 */
export interface IUserWrappr {
    getStatus(): IInitializationStatus;
    initialize(): Promise<ILoadResult<TWhatevertehfuckitscalled>>;
}
