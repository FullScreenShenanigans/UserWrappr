import { ICreateWrappingView } from "../Display";
import { ICreateElement } from "../Elements/createElement";
import { IMenu } from "../Menus/Menus";
import { IAbsoluteSizeSchema } from "../Sizing";

/**
 * Class names to use for menu area elements.
 */
export interface IMenuClassNames {
    /**
     * Class name for the surrounding area div.
     */
    area: string;

    /**
     * Class name for each menu title.
     */
    title: string;
}
/**
 * Dependencies to initialize a new MenuBinder.
 */
export interface IMenuBinderDependencies {
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
     * Class names to use for menu area elements.
     */
    menuClassNames: IMenuClassNames;

    /**
     * Menus to create inside of the container.
     */
    menus: IMenu[];
}

/**
 * Creates placeholder menu titles and binds them to real menus.
 */
export class MenuBinder {
    /**
     * Dependencies used for initialization.
     */
    private readonly dependencies: IMenuBinderDependencies;

    /**
     * Initializes a new instance of the MenuBinder class.
     *
     * @param dependencies   Dependencies to be used for initialization.
     */
    public constructor(dependencies: IMenuBinderDependencies) {
        this.dependencies = dependencies;
    }

    /**
     * Creates a realistically sized area for menu titles.
     *
     * @returns A Promise for the remaining usable space within the container.
     */
    public async createTitleArea(): Promise<IAbsoluteSizeSchema> {
        const area = this.createAreaWithMenuTitles();
        this.dependencies.container.appendChild(area);

        const reducedSize = area.getBoundingClientRect();

        return {
            height: this.dependencies.containerSize.height - reducedSize.height,
            width: this.dependencies.containerSize.width - reducedSize.width
        };
    }

    public async bindMenuTitles(createWrappingView: ICreateWrappingView): Promise<void> {
        // todo: this
        await Promise.resolve(createWrappingView);
    }

    /**
     * Creates an area with titles for each menu.
     *
     * @returns An area with titles for each menu.
     */
    private createAreaWithMenuTitles(): HTMLElement {
        const area = this.dependencies.createElement("div", {
            className: this.dependencies.menuClassNames.area
        });

        for (const menu of this.dependencies.menus) {
            area.appendChild(
                this.dependencies.createElement("div", {
                    children: [
                        this.dependencies.createElement("span", {
                            textContent: menu.title
                        })
                    ],
                    className: this.dependencies.menuClassNames.title
                }));
        }

        return area;
    }
}
