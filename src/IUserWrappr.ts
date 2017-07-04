import { IScreenVisibilityTogglerSettings } from "./ScreenVisibilityToggler";

/**
 * Settings to initialize a new IUserWrappr.
 */
export type IUserWrapprSettings = IScreenVisibilityTogglerSettings;

/**
 * A user interface wrapper for configurable HTML displays over GameStartr games.
 */
export interface IUserWrappr {
    /**
     * Resets event listener pipes.
     */
    resetEvents(): void;
}
