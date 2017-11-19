import { Display } from "./Display";

/**
 * Loads runtime-required libraries for the wrapped contents.
 *
 * @returns A Promise for loading the runtime-required libraries.
 */
export type ILoadContentLibraries = () => Promise<void>;

/**
 * Loads external scripts.
 *
 * @param modules   Module identifiers of the scripts.
 * @param onComplete   Handler for load success.
 * @param onError   Handler for load failure.
 */
export type IRequireJs = (modules: string[], onComplete: Function, onError: Function) => void;

/**
 * Settings to initialize a new IUserWrappr.
 */
export interface IUserWrapprSettings {
    /**
     * HTML element to create a view within.
     */
    container: HTMLElement;

    /**
     * Require paths to delayed UserWrappr scripts.
     */
    delayedScripts: string;

    /**
     * Loads external scripts.
     */
    requirejs: IRequireJs;
}

/**
 * Creates configurable HTML displays over fixed size contents.
 */
export interface IUserWrappr {
    /**
     * Initializes a new display and contents.
     *
     * @returns A Promise for a Display wrapper around contents and their view.
     */
    createDisplay(): Promise<Display>;
}
