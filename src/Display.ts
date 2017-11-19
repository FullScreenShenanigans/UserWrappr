import { ICreateElement } from "./Elements/createElement";
import { IMenuClassNames, MenuBinder } from "./MenuBinding/MenuBinder";
import { MenuBinderFactory } from "./MenuBinding/MenuBinderFactory";
import { IMenu } from "./Menus/Menus";
import { getAbsoluteSizeInContainer, IAbsoluteSizeSchema, IRelativeSizeSchema } from "./Sizing";

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
export interface IWrappingViewDependencies {
    /**
     * Element to create a view within.
     */
    container: HTMLElement;

    /**
     * Menus to create inside of the container.
     */
    menus: IMenu[];

    /**
     * Hook to reset contents to the wrapping size.
     */
    setSize: ISetSize;
}

/**
 * Creates a wrapping contents view in a container.
 *
 * @param container   Container to create a view within.
 * @param schema   Descriptions of menu options.
 */
export type ICreateWrappingView = (dependencies: IWrappingViewDependencies) => Promise<void>;

/**
 * Dependencies to initialize a new Display.
 */
export interface IDisplayDependencies {
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
     * Class names to use for menu area elements.
     */
    menuClassNames: IMenuClassNames;

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
     * Creates MenuBinders for containers.
     */
    private readonly menuBinderFactory: MenuBinderFactory;

    /**
     * Initializes a new instance of the Display class.
     *
     * @param dependencies   Dependencies to be used for initialization.
     */
    public constructor(dependencies: IDisplayDependencies) {
        this.dependencies = dependencies;
        this.menuBinderFactory = new MenuBinderFactory(dependencies);
    }

    /**
     * Resets the internal contents to a new size.
     *
     * @param requestedSize   New size of the contents.
     * @returns A Promise for a MenuBinder for the requested size.
     */
    public resetContents = async (requestedSize: IRelativeSizeSchema): Promise<MenuBinder> => {
        const windowSize: IAbsoluteSizeSchema = this.dependencies.getWindowSize();
        const containerSize: IAbsoluteSizeSchema = getAbsoluteSizeInContainer(windowSize, requestedSize);
        const menuBinder = this.menuBinderFactory.createForSize(containerSize);
        const contentSize: IAbsoluteSizeSchema = await menuBinder.createTitleArea();

        this.dependencies.createContents(this.dependencies.container, contentSize);

        return menuBinder;
    }
}
