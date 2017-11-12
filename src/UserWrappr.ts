import { ILoadResult, IUserWrapprSettings, LoadingStatus } from "./IUserWrappr";

/**
 * Creates configurable HTML displays over GameStartr games.
 */
export class UserWrappr {
    /**
     * 
     */
    private readonly settings: IUserWrapprSettings;

    /**
     * 
     */
    private loadingStatus: LoadingStatus;

    public constructor(settings: IUserWrapprSettings) {
        this.loadingStatus = LoadingStatus.NotStarted;
        this.settings = settings;
    }

    public async initialize(): Promise<ILoadResult> {
        if (this.loadingStatus !== LoadingStatus.NotStarted) {
            throw new Error("Cannot initialize twice.");
        }

        this.loadingStatus = LoadingStatus.InProgress;

        const loadResult = await this.settings.loadLibraries();

        this.loadingStatus = LoadingStatus.Complete;

        return loadResult;
    }
}
