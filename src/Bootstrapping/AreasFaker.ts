import { IClassNames } from "../Display";
import { ICreateElement } from "../Elements/createElement";
import { IMenuSchema } from "../Menus/MenuSchemas";
import { getAbsoluteSizeRemaining, IAbsoluteSizeSchema } from "../Sizing";
import { innerAreaStyle, menuStyle, menuTitleStyle } from "./MenuStyles";

/**
 * Dependencies to initialize a new AreasFaker.
 */
export interface IAreasFakerDependencies {
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
     * Menus to create inside of the container.
     */
    menus: IMenuSchema[];
}

/**
 * Creates placeholder menu titles before a real menu is created.
 */
export class AreasFaker {
    /**
     * Dependencies used for initialization.
     */
    private readonly dependencies: IAreasFakerDependencies;

    /**
     * Initializes a new instance of the AreasFaker class.
     *
     * @param dependencies   Dependencies to be used for initialization.
     */
    public constructor(dependencies: IAreasFakerDependencies) {
        this.dependencies = dependencies;
    }

    /**
     * Creates and adds a realistically sized area for menu titles.
     *
     * @returns A Promise for the remaining usable space within the container.
     */
    public async addMenuArea() {
        const menuArea = this.createAreaWithMenuTitles();
        this.dependencies.container.appendChild(menuArea);

        const menuSize = menuArea.getBoundingClientRect();

        return { menuArea, menuSize };
    }

    /**
     * Creates an area the expected available size for content.
     *
     * @param containerSize   Size of the parent container.
     * @param menuAreaSize   Size taken up by the menu.
     */
    public createContentArea(containerSize: IAbsoluteSizeSchema, menuAreaSize: IAbsoluteSizeSchema) {
        const contentSize = getAbsoluteSizeRemaining(containerSize, menuAreaSize);
        const contentArea = this.dependencies.createElement("div", {
            style: {
                height: `${contentSize.height}px`,
                position: "relative",
                width: `${contentSize.width}px`,
            }
        });

        return { contentSize, contentArea };
    }

    /**
     * Creates an area with titles for each menu.
     *
     * @returns An area with titles for each menu.
     */
    private createAreaWithMenuTitles(): HTMLElement {
        const innerArea = this.dependencies.createElement("div", {
            className: this.dependencies.classNames.innerArea,
            style: innerAreaStyle
        });
        const outerArea = this.dependencies.createElement("div", {
            className: this.dependencies.classNames.outerArea,
            children: [innerArea]
        });

        for (const menu of this.dependencies.menus) {
            innerArea.appendChild(
                this.dependencies.createElement("div", {
                    className: this.dependencies.classNames.menu,
                    children: [
                        this.dependencies.createElement("h4", {
                            className: this.dependencies.classNames.menuTitle,
                            style: menuTitleStyle,
                            textContent: menu.title
                        })
                    ],
                    style: menuStyle
                }));
        }

        return outerArea;
    }
}
