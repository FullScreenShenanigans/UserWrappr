import { IMenu } from "./Menus/Menus";
import { getAbsoluteSizeFromSchema, IAbsoluteSizeSchema, IRelativeSizeSchema } from "./Sizing";

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
     * Menus to create inside of the element.
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
     * Container that will contain the contents and wrapping view.
     */
    container: HTMLElement;

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
 * Contains a wrapping view around contents within a container.
 */
export class Display {
    /**
     * Dependencies used for initialization.
     */
    private readonly dependencies: IDisplayDependencies;

    /**
     * Initializes a new instance of the Display class.
     *
     * @param dependencies   Dependencies to be used for initialization.
     */
    public constructor(dependencies: IDisplayDependencies) {
        this.dependencies = dependencies;
    }

    /**
     * Resets the internal contents to a new size.
     *
     * @param requestedSize   New size of the contents.
     */
    public resetContents = async (requestedSize: IRelativeSizeSchema): Promise<void> => {
        const windowSize: IAbsoluteSizeSchema = this.dependencies.getWindowSize();
        const containerSize: IAbsoluteSizeSchema = getAbsoluteSizeFromSchema(windowSize, requestedSize);
        const contentSize: IAbsoluteSizeSchema = await this.menuLauncher.createTitleArea(
            this.dependencies.container,
            this.dependencies.menus,
            containerSize);

        this.dependencies.createContents(this.dependencies.container, contentSize);
    }

    /**
     * Resets the wrapping view around the contents.
     *
     * @param createWrappingView   Creates a wrapping view in a container.
     */
    public async resetWrappingView(createWrappingView: ICreateWrappingView): Promise<void> {
        this.menuLauncher.bindMenuTitles({
            container: this.dependencies.container,
            createWrappingView,
            menus: this.dependencies.menus,
            setSize: this.resetContents
        });
    }
}
