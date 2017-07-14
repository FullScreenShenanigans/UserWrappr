import { IPipe } from "inputwritr/lib/IInputWritr";
import { IRootOptionsDisplayerSettings } from "./Displayers/RootOptionsDisplayer";
import { IGamepadPollerSettings } from "./GamepadPoller";
import { IScreenVisibilityTogglerSettings } from "./ScreenVisibilityToggler";
import { ISizeSummaries, ISizeSummary } from "./SizeChanger";

/**
 * Pipes an input event listener to an InputWritr pipe.
 *
 * @param type   Type of the event.
 * @param pipe   InputWritr pipe to receive the listener's events.
 */
export interface IAddInputPipe {
    (type: string, pipe: IPipe): void;
}

/**
 * Settings to initialize a new IUserWrappr.
 */
export interface IUserWrapprSettings extends IGamepadPollerSettings, IRootOptionsDisplayerSettings, IScreenVisibilityTogglerSettings {
    /**
     * Pipes an input event listener to an InputWritr pipe.
     */
    addInputPipe: IAddInputPipe;

    /**
     * Closes any full screen state.
     */
    cancelFullScreen: () => void;

    /**
     * Requests to start a full screen state.
     */
    requestFullScreen: () => void;

    /**
     * Size summaries keyed by name.
     */
    sizes: ISizeSummaries;
}

/**
 * A user interface wrapper for configurable HTML displays over GameStartr games.
 */
export interface IUserWrappr {
    /**
     * Resets the visual aspect of the controls.
     */
    resetControls(): void;

    /**
     * Resets event listener pipes.
     */
    resetEvents(): void;

    /**
     * Resets to a particular size.
     *
     * @param size   The size to set, as either its name or settings.
     */
    setSize(size: string | ISizeSummary): void;
}
