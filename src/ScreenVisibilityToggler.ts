import { IPipe } from "inputwritr/lib/IInputWritr";

/**
 * Pipes a document event listener to an InputWritr pipe.
 *
 * @param type   Type of the event.
 * @param pipe   InputWritr pipe to receive the listener's events.
 */
export interface IAddDocumentPipe {
    (type: string, pipe: IPipe): void;
}

/**
 * Settings to initialize a new instance of the ScreenVisibilityToggler class.
 */
export interface IScreenVisibilityTogglerSettings {
    /**
     * Pipes a document event listener to an InputWritr pipe.
     */
    addDocumentPipe: IAddDocumentPipe;

    /**
     * @returns Whether the game is paused.
     */
    getPaused(): boolean;

    /**
     * @returns Whether the document is visible.
     */
    getVisibilityState(): "hidden" | "visible";

    /**
     * Pauses the game.
     */
    pause(): void;

    /**
     * Plays the game.
     */
    play(): void;
}

/**
 * Toggles GameStartr gameplay on screen visibility.
 */
export class ScreenVisibilityToggler {
    /**
     * Whether the page is hidden due to the game being paused.
     */
    private isPageHiddenDuringPlay: boolean = false;

    /**
     * Settings used for initialization.
     */
    private readonly settings: IScreenVisibilityTogglerSettings;

    /**
     * Initializes a new instance of the ScreenVisibilityToggler class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IScreenVisibilityTogglerSettings) {
        this.settings = settings;
    }

    /**
     * Toggles whether the screen should be visible.
     */
    public toggle(): void {
        switch (this.settings.getVisibilityState()) {
            case "hidden":
                this.onPageHidden();
                return;

            case "visible":
                this.onPageVisible();
                return;

            default:
                return;
        }
    }

    /**
     * Reacts to the page becoming hidden by pausing the GameStartr.
     */
    private onPageHidden(): void {
        if (!this.settings.getPaused()) {
            this.isPageHiddenDuringPlay = true;
            this.settings.pause();
        }
    }

    /**
     * Reacts to the page becoming visible by unpausing the GameStartr.
     */
    private onPageVisible(): void {
        if (this.isPageHiddenDuringPlay) {
            this.isPageHiddenDuringPlay = false;

            if (this.settings.getPaused()) {
                this.settings.play();
            }
        }
    }
}
