import { AreasFaker } from "./Bootstrapping/AreasFaker";
import { IClassNames } from "./Bootstrapping/ClassNames";
import { ICreateElement } from "./Bootstrapping/CreateElement";
import { IGetAvailableContainerSize } from "./Bootstrapping/GetAvailableContainerSize";
import { IStyles } from "./Bootstrapping/Styles";
import { IMenuSchema } from "./Menus/MenuSchemas";
import { getAbsoluteSizeInContainer, IAbsoluteSizeSchema, IRelativeSizeSchema } from "./Sizing";

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
 * Menu and content elements, once creatd.
 */
interface ICreatedElements {
    /**
     * Contains the created contents.
     */
    contentArea: HTMLElement;

    /**
     * Contains the real or fake menu elements.
     */
    menuArea: HTMLElement;
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
    getAvailableContainerSize: IGetAvailableContainerSize;

    /**
     * Menus to create inside of the view.
     */
    menus: IMenuSchema[];

    /**
     * Styles to use for display elements.
     */
    styles: IStyles;
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
     * Menu and content elements, once created.
     */
    private createdElements: ICreatedElements | undefined;

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
     * Creates initial contents and fake menus.
     *
     * @param requestedSize   Size of the contents.
     * @returns A Promise for having created initial contents and fake menus.
     */
    public async resetContents(requestedSize: IRelativeSizeSchema): Promise<void> {
        if (this.createdElements !== undefined) {
            this.dependencies.container.removeChild(this.createdElements.contentArea);
            this.dependencies.container.removeChild(this.createdElements.menuArea);
        }

        const availableContainerSize: IAbsoluteSizeSchema = this.dependencies.getAvailableContainerSize(this.dependencies.container);
        const containerSize: IAbsoluteSizeSchema = getAbsoluteSizeInContainer(availableContainerSize, requestedSize);
        const { menuArea, menuSize } = await this.areasFaker.createAndAppendMenuArea(containerSize);
        const { contentSize, contentArea } = this.areasFaker.createContentArea(containerSize, menuSize);

        this.dependencies.container.insertBefore(contentArea, menuArea);
        contentArea.appendChild(this.dependencies.createContents(contentSize));

        this.createdElements = { contentArea, menuArea };
    }
}
