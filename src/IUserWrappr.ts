import { Display, ICreateContents, IDisplayDependencies, IGetWindowSize } from "./Display";
import { IMenu } from "./Menus/Menus";
import { IRelativeSizeSchema } from "./Sizing";

export { ICreateContents, IDisplayDependencies, IGetWindowSize } from "./Display";
export { IRelativeSizeSchema } from "./Sizing";

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
export interface IUserWrapprSettings extends IDisplayDependencies {
    /**
     * HTML element to create a view within.
     */
    container: HTMLElement;

    /**
     * Creates contents for a size.
     */
    createContents: ICreateContents;

    /**
     * Require paths to delayed UserWrappr scripts.
     */
    delayedScripts: string;

    /**
     * Initial size to create a container at.
     */
    defaultSize: IRelativeSizeSchema;

    /**
     * Gets the rectangular size of the window.
     */
    getWindowSize: IGetWindowSize;

    /**
     * Menus to create inside of the container.
     */
    menus: IMenu[];

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
