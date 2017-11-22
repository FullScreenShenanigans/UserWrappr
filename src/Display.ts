import { AreasFaker } from "./Bootstrapping/AreasFaker";
import { ICreateElement } from "./Elements/createElement";
import { IGetAvailableContainerSize } from "./Elements/getAvailableContainerSize";
import { IMenuSchema } from "./Menus/MenuSchemas";
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
 * @param size   Bounding size to create contents in.
 * @returns Contents at the size.
 */
export type ICreateContents = (size: IAbsoluteSizeSchema) => Element;

/**
 * Hook to reset contents to a size.
 *
 * @param size   Rectangular size of an area.
 * @returns A Promise for resetting contents to the size.
 */
export type ISetSize = (size: IRelativeSizeSchema) => Promise<void>;

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
    getAvailableContainerSize: IGetAvailableContainerSize;

    /**
     * Menus to create inside of the view.
     */
    menus: IMenuSchema[];
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
     * Creates placeholder menu titles before a real menu is created.
     */
    private readonly areasFaker: AreasFaker;

    /**
     * Initializes a new instance of the Display class.
     *
     * @param dependencies   Dependencies to be used for initialization.
     */
    public constructor(dependencies: IDisplayDependencies) {
        this.dependencies = dependencies;
        this.areasFaker = new AreasFaker(this.dependencies);
    }

    /**
     * Resets the internal contents to a new size.
     *
     * @param requestedSize   New size of the contents.
     * @returns A Promise for a AreasFaker for the requested size.
     */
    public resetContents = async (requestedSize: IRelativeSizeSchema): Promise<void> => {
        const availableContainerSize: IAbsoluteSizeSchema = this.dependencies.getAvailableContainerSize(this.dependencies.container);
        const containerSize: IAbsoluteSizeSchema = getAbsoluteSizeInContainer(availableContainerSize, requestedSize);
        const { menuArea, menuSize } = await this.areasFaker.addMenuArea();
        const { contentSize, contentArea } = this.areasFaker.createContentArea(containerSize, menuSize);

        this.dependencies.container.insertBefore(contentArea, menuArea);

        const contents = this.dependencies.createContents(contentSize);
        contentArea.appendChild(contents);
    }
}
