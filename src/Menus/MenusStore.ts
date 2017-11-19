import { IClassNames, ISetSize } from "../Display";
import { IMenu } from "./Menus";
import { ISetTimeout, MenuStore } from "./MenuStore";
import { OptionsStore } from "./Options/OptionsStore";

/**
 * Menu and option pairing.
 */
export interface IMenuAndOptionsListStores {
    /**
     * Wrapping menu.
     */
    menu: MenuStore;

    /**
     * Contained options.
     */
    options: OptionsStore;
}

/**
 * Dependencies to initialize a new MenusStore.
 */
export interface IMenusStoreDependencies {
    /**
     * Class names to use for display elements.
     */
    classNames: IClassNames;

    /**
     * Menu schemas to render.
     */
    menus: IMenu[];

    /**
     * Waits before calling an action.
     */
    setTimeout: ISetTimeout;

    /**
     * Hook to reset contents to a size.
     */
    setSize: ISetSize;

    /**
     * How long to transition between visual states.
     */
    transitionTime: number;
}

export class MenusStore {
    /**
     * Dependencies used for initialization.
     */
    private readonly dependencies: IMenusStoreDependencies;

    /**
     * Stores for each menu and options pairing.
     */
    private readonly childStores: IMenuAndOptionsListStores[];

    /**
     * Initializes a new instance of the MenusStore class.
     *
     * @param dependencies   Dependencies used for initialization.
     */
    public constructor(dependencies: IMenusStoreDependencies) {
        this.dependencies = dependencies;

        this.childStores = this.createMenuStores();
    }

    /**
     * Class names to use for display elements.
     */
    public get classNames(): IClassNames {
        return this.dependencies.classNames;
    }

    /**
     * Stores for each menu and options pairing.
     */
    public get menuAndOptionListStores(): IMenuAndOptionsListStores[] {
        return this.childStores;
    }

    /**
     * Creates stores for child menus and options.
     *
     * @returns Stores for child menus and options.
     */
    private createMenuStores(): IMenuAndOptionsListStores[] {
        const stores: IMenuAndOptionsListStores[] = [];

        for (const menu of this.dependencies.menus) {
            stores.push({
                menu: new MenuStore({
                    classNames: this.dependencies.classNames,
                    setTimeout: this.dependencies.setTimeout,
                    title: menu.title,
                    transitionTime: this.dependencies.transitionTime
                }),
                options: new OptionsStore({
                    classNames: this.dependencies.classNames,
                    options: menu.options
                })
            });
        }

        return stores;
    }
}
