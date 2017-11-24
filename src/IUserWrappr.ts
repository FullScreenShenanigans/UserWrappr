import { IClassNames } from "./Bootstrapping/ClassNames";
import { ICreateElement } from "./Bootstrapping/CreateElement";
import { IGetAvailableContainerSize } from "./Bootstrapping/GetAvailableContainerSize";
import { IStyles } from "./Bootstrapping/Styles";
import { ICreateContents } from "./Display";
import { IMenuSchema } from "./Menus/MenuSchemas";
import { ISetTimeout } from "./Menus/MenuStore";
import { IRelativeSizeSchema } from "./Sizing";

/**
 * Loads external scripts.
 *
 * @param modules   Module identifiers of the scripts.
 * @param onComplete   Handler for load success.
 * @param onError   Handler for load failure.
 */
export type IRequireJs = (modules: string[], onComplete: Function, onError: Function) => void;

/**
 * Filled-out optional settings to initialize a new IUserWrappr.
 */
export interface IOptionalUserWrapprSettings {
    /**
     * Class names to use for display elements.
     */
    classNames: IClassNames;

    /**
     * Creates a new HTML element.
     */
    createElement: ICreateElement;

    /**
     * Initial size to create a container at.
     */
    defaultSize: IRelativeSizeSchema;

    /**
     * Gets the rectangular size of the window.
     */
    getAvailableContainerSize: IGetAvailableContainerSize;

    /**
     * Require path to the menu initialization script.
     */
    menuInitializer: string;

    /**
     * Menus to create inside of the container.
     */
    menus: IMenuSchema[];

    /**
     * Waits before calling an action.
     */
    setTimeout: ISetTimeout;

    /**
     * Styles to use for display elements.
     */
    styles: IStyles;

    /**
     * How long to transition between visual states.
     */
    transitionTime: number;

    /**
     * Loads external scripts.
     */
    requirejs: IRequireJs;
}

/**
 * Acceptable optional settings to initialize a new IUserWrappr.
 */
export interface IPartialOptionalUserWrapprSettings {
    /**
     * Class names to use for display elements.
     */
    classNames: Partial<IClassNames>;

    /**
     * Creates a new HTML element.
     */
    createElement: ICreateElement;

    /**
     * Initial size to create a container at.
     */
    defaultSize: IRelativeSizeSchema;

    /**
     * Gets the rectangular size of the window.
     */
    getAvailableContainerSize: IGetAvailableContainerSize;

    /**
     * Require path to the menu initialization script.
     */
    menuInitializer: string;

    /**
     * Menus to create inside of the container.
     */
    menus: IMenuSchema[];

    /**
     * Waits before calling an action.
     */
    setTimeout: ISetTimeout;

    /**
     * Styles to use for display elements.
     */
    styles: Partial<IStyles>;

    /**
     * How long to transition between visual states.
     */
    transitionTime: number;

    /**
     * Loads external scripts.
     */
    requirejs: IRequireJs;
}

/**
 * Required settings to initialize a new IUserWrappr.
 */
export interface IRequiredUserWrapprSettings {
    /**
     * Creates contents for a size.
     */
    createContents: ICreateContents;
}

/**
 * Settings to initialize a new IUserWrappr.
 */
export type IUserWrapprSettings = IPartialOptionalUserWrapprSettings & IRequiredUserWrapprSettings;

/**
 * Filled-out settings to initialize a new IUserWrappr.
 */
export type ICompleteUserWrapprSettings = IOptionalUserWrapprSettings & IRequiredUserWrapprSettings;

/**
 * Creates configurable HTML displays over fixed size contents.
 */
export interface IUserWrappr {
    /**
     * Initializes a new display and contents.
     *
     * @param container   Element to instantiate contents within.
     * @returns A Promise for having created contents and menus.
     */
    createDisplay(container: HTMLElement): Promise<void>;

    /**
     * Resets the internal contents to a new size, if created yet.
     *
     * @param size   New size of the contents.
     * @returns Whether the display was available to reset size.
     */
    resetSize(size: IRelativeSizeSchema): boolean;
}
