import { ICreateElement } from "./Elements/createElement";
import { MenuFakerFactory } from "./MenuFaking/MenuFakerFactory";
import { IMenu } from "./Menus/Menus";
import { IMenusStoreDependencies } from "./Menus/MenusStore";
import { getAbsoluteSizeInContainer, IAbsoluteSizeSchema, IRelativeSizeSchema } from "./Sizing";

/**
 * Class names to use for display elements.
 */
export interface IClassNames {
    /**
     * Class name for the inner area div.
     */
    innerArea: string;

    /**
     * Class name for each options list div.
     */
    options: string;

    /**
     * Class name for the surrounding area div.
     */
    outerArea: string;

    /**
     * Class name for each menu's div.
     */
    menu: string;

    /**
     * Class name for each menu title div.
     */
    menuTitle: string;
}

/**
 * Creates contents for a size.
 *
 * @param container   Container for the contents.
 * @param size   Size to create.
 */
export type ICreateContents = (container: HTMLElement, size: IAbsoluteSizeSchema) => void;

/**
 * Gets the rectangular size of the window.
 *
 * @returns The rectangular size of the window.
 */
export type IGetWindowSize = () => IAbsoluteSizeSchema;

/**
 * Hook to reset contents to a size.
 *
 * @param size   Rectangular size of an area.
 * @returns A Promise for resetting contents to the size.
 */
export type ISetSize = (size: IRelativeSizeSchema) => Promise<void>;

/**
 * Dependencies to create a wrapping view in an element.
 */
export interface IWrappingViewDependencies extends IMenusStoreDependencies {
    /**
     * Element to create a view within.
     */
    container: HTMLElement;
}

/**
 * Dependencies to initialize a new Display.
 */
export interface IDisplayDependencies {
    /**
     * Class names to use for display elements.
     */
    classNames: IClassNames;

    /**
     * Container that will contain the contents and menus.
     */
    container: HTMLElement;

    /**
     * Creates a new HTML element.
     */
    createElement: ICreateElement;

    /**
     * Creates contents within a container.
     */
    createContents: ICreateContents;

    /**
     * Gets the rectangular size of the window.
     */
    getWindowSize: IGetWindowSize;

    /**
     * Menus to create inside of the view.
     */
    menus: IMenu[];
}

/**
 * Contains contents and menus within a container.
 */
export class Display {
    /**
     * Dependencies used for initialization.
     */
    private readonly dependencies: IDisplayDependencies;

    /**
     * Creates MenuFakers for containers.
     */
    private readonly MenuFakerFactory: MenuFakerFactory;

    /**
     * Initializes a new instance of the Display class.
     *
     * @param dependencies   Dependencies to be used for initialization.
     */
    public constructor(dependencies: IDisplayDependencies) {
        this.dependencies = dependencies;
        this.MenuFakerFactory = new MenuFakerFactory(dependencies);
    }

    /**
     * Resets the internal contents to a new size.
     *
     * @param requestedSize   New size of the contents.
     * @returns A Promise for a MenuFaker for the requested size.
     */
    public resetContents = async (requestedSize: IRelativeSizeSchema): Promise<void> => {
        const windowSize: IAbsoluteSizeSchema = this.dependencies.getWindowSize();
        const containerSize: IAbsoluteSizeSchema = getAbsoluteSizeInContainer(windowSize, requestedSize);
        const menuFaker = this.MenuFakerFactory.createForSize(containerSize);
        const contentSize: IAbsoluteSizeSchema = await menuFaker.fakeMenuArea();

        this.dependencies.createContents(this.dependencies.container, contentSize);
    }
}
