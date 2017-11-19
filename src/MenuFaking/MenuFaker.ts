import { IClassNames } from "../Display";
import { ICreateElement } from "../Elements/createElement";
import { IMenu } from "../Menus/Menus";
import { IAbsoluteSizeSchema } from "../Sizing";

/**
 * Dependencies to initialize a new MenuFaker.
 */
export interface IMenuFakerDependencies {
    /**
     * Container that will contain the contents and menus.
     */
    container: HTMLElement;

    /**
     * Usable size of the container.
     */
    containerSize: IAbsoluteSizeSchema;

    /**
     * Creates a new HTML element.
     */
    createElement: ICreateElement;

    /**
     * Class names to use for display elements.
     */
    classNames: IClassNames;

    /**
     * Menus to create inside of the container.
     */
    menus: IMenu[];
}

/**
 * Creates placeholder menu titles before a real menu is created.
 */
export class MenuFaker {
    /**
     * Dependencies used for initialization.
     */
    private readonly dependencies: IMenuFakerDependencies;

    /**
     * Initializes a new instance of the MenuFaker class.
     *
     * @param dependencies   Dependencies to be used for initialization.
     */
    public constructor(dependencies: IMenuFakerDependencies) {
        this.dependencies = dependencies;
    }

    /**
     * Creates a realistically sized area for menu titles.
     *
     * @returns A Promise for the remaining usable space within the container.
     */
    public async fakeMenuArea(): Promise<IAbsoluteSizeSchema> {
        const area = this.createAreaWithMenuTitles();
        this.dependencies.container.appendChild(area);

        const reducedSize = area.getBoundingClientRect();

        return {
            height: this.dependencies.containerSize.height - reducedSize.height,
            width: this.dependencies.containerSize.width - reducedSize.width
        };
    }

    /**
     * Creates an area with titles for each menu.
     *
     * @returns An area with titles for each menu.
     */
    private createAreaWithMenuTitles(): HTMLElement {
        const innerArea = this.dependencies.createElement("div", {
            className: this.dependencies.classNames.innerArea
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
                        this.dependencies.createElement("div", {
                            className: this.dependencies.classNames.menuTitle,
                            textContent: menu.title
                        })
                    ]
                }));
        }

        return outerArea;
    }
}
