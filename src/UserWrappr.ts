import { GamepadPoller } from "./GamepadPoller";
import { IUserWrappr, IUserWrapprSettings } from "./IUserWrappr";
import { ScreenVisibilityToggler } from "./ScreenVisibilityToggler";
import { ISizeSummary, SizeChanger } from "./SizeChanger";

/**
 * A user interface wrapper for configurable HTML displays over GameStartr games.
 */
export class UserWrappr implements IUserWrappr {
    /**
     * Polls gamepad state for a GameStartr's DeviceLayr.
     */
    private readonly gamepadPoller: GamepadPoller;

    /**
     * Settings used for initialization.
     */
    private readonly settings: IUserWrapprSettings;

    /**
     * Toggles whether the screen is visible during gameplay.
     */
    private readonly screenVisibilityToggler: ScreenVisibilityToggler;

    /**
     * Changes screen size on request.
     */
    private readonly sizeChanger: SizeChanger;

    /**
     * Initializes a new instance of the UserWrappr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IUserWrapprSettings) {
        this.settings = settings;

        this.gamepadPoller = new GamepadPoller(this.settings);
        this.screenVisibilityToggler = new ScreenVisibilityToggler(this.settings);
        this.sizeChanger = new SizeChanger({
            ...settings,
            onReset: (size: ISizeSummary): void => {
                this.settings.gameStarter.reset(size);
            }
        });

        this.resetEvents();
    }

    /**
     * Resets event listener pipes.
     */
    public resetEvents(): void {
        this.settings.addInputPipe(
            "keydown",
            this.settings.gameStarter.inputWriter.makePipe("onkeydown", "keyCode"));

        this.settings.addInputPipe(
            "keyup",
            this.settings.gameStarter.inputWriter.makePipe("onkeyup", "keyCode"));

        this.settings.addInputPipe(
            "mousedown",
            this.settings.gameStarter.inputWriter.makePipe("onmousedown", "which"));

        this.settings.addInputPipe(
            "contextmenu",
            this.settings.gameStarter.inputWriter.makePipe("oncontextmenu", "", true));

        this.settings.addDocumentPipe(
            "visibilitychange",
            (): void => this.screenVisibilityToggler.toggle());
    }

    /**
     * Resets to a particular size.
     *
     * @param size   The size to set, as either its name or settings.
     */
    public setSize(size: string | ISizeSummary): void {
        this.sizeChanger.setSize(size);
    }
}
