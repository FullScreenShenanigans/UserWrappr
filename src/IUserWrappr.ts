import { GameStartr } from "gameStartr/lib/GameStartr";
import { IPipe } from "inputwritr/lib/IInputWritr";
import { IScreenVisibilityTogglerSettings } from "./ScreenVisibilityToggler";

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
export interface IUserWrapprSettings extends IScreenVisibilityTogglerSettings {
    /**
     * Pipes an input event listener to an InputWritr pipe.
     */
    addInputPipe: IAddInputPipe;

    /**
     * GameStartr instance being wrapped around.
     */
    gameStarter: GameStartr;
}

/**
 * A user interface wrapper for configurable HTML displays over GameStartr games.
 */
export interface IUserWrappr {
    /**
     * Resets event listener pipes.
     */
    resetEvents(): void;
}
