import { IUserWrappr, IUserWrapprSettings } from "./IUserWrappr";
import { ScreenVisibilityToggler } from "./ScreenVisibilityToggler";

/**
 * A user interface wrapper for configurable HTML displays over GameStartr games.
 */
export class UserWrappr implements IUserWrappr {
    /**
     * Settings used for initialization.
     */
    private readonly settings: IUserWrapprSettings;

    /**
     * Toggles whether the screen is visible during gameplay.
     */
    private readonly screenVisibilityToggler: ScreenVisibilityToggler;

    /**
     * Initializes a new instance of the UserWrappr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IUserWrapprSettings) {
        this.settings = settings;
        this.screenVisibilityToggler = new ScreenVisibilityToggler(this.settings);
    }

    /**
     * Resets event listener pipes.
     */
    public resetEvents(): void {
        this.settings.addDocumentPipe(
            "visibilitychange",
            (): void => this.screenVisibilityToggler.toggle());
    }
}
