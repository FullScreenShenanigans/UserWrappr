
/**
 * How wide and tall an IUserWrappr's contained GameStartr should be sized.
 */
export interface ISizeSummary {
    /**
     * How wide the contained GameStartr should be, as a standard Number or Infinity.
     */
    width: number;

    /**
     * How tall the contained GameStartr should be, as a standard Number or Infinity.
     */
    height: number;

    /**
     * Whether the contained GameStartr should request full screen size.
     */
    full?: boolean;

    /**
     * What this size summary should be referred to, if not its key in the container.
     */
    name?: string;
}

/**
 * Size summaries keyed by name.
 */
export interface ISizeSummaries {
    [i: string]: ISizeSummary;
}

/**
 * Settings to initialize a new instance of the SizeChanger class.
 */
export interface ISizeChangerSettings {
    /**
     * Size summaries keyed by name.
     */
    sizes: ISizeSummaries;

    /**
     * Closes any full screen state.
     */
    cancelFullScreen(): void;

    /**
     * Handler on resets.
     *
     * @param size   Size to reset to.
     */
    onReset(size: ISizeSummary): void;

    /**
     * Requests to start a full screen state.
     */
    requestFullScreen(): void;
}

/**
 * Changes screen size on request.
 */
export class SizeChanger {
    /**
     * Whether a full screen state has been requested.
     */
    private isFullScreen: boolean = false;

    /**
     * Settings used for initialization.
     */
    private readonly settings: ISizeChangerSettings;

    /**
     * Initializes a new instance of the SizeChanger class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: ISizeChangerSettings) {
        this.settings = settings;
    }

    /**
     * Resets to a particular size.
     *
     * @param size   The size to set, as either its name or settings.
     */
    public setSize(size: string | ISizeSummary): void {
        if (typeof size === "string") {
            if (this.settings.sizes[size] === undefined) {
                throw new Error(`Size '${size}' does not exist on the UserWrappr.`);
            }

            size = this.settings.sizes[size];
        }

        if (size.full) {
            this.settings.requestFullScreen();
            this.isFullScreen = true;
        } else if (this.isFullScreen) {
            this.settings.cancelFullScreen();
            this.isFullScreen = false;
        }

        this.settings.onReset(size);
    }
}
