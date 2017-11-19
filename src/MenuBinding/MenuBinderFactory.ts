import { ICreateElement } from "../Elements/createElement";
import { IMenu } from "../Menus/Menus";
import { IAbsoluteSizeSchema } from "../Sizing";
import { IMenuClassNames, MenuBinder } from "./MenuBinder";

/**
 * Dependencies to initialize a new MenuBinderFactory.
 */
export interface IMenuBinderFactoryDependencies {
    /**
     * Container to bind within.
     */
    container: HTMLElement;

    /**
     * Creates a new HTML element.
     */
    createElement: ICreateElement;

    /**
     * Menus to create inside of the container.
     */
    menus: IMenu[];

    /**
     * Class names to use for menu area elements.
     */
    menuClassNames: IMenuClassNames;
}

/**
 * Creates MenuBinders for containers.
 */
export class MenuBinderFactory {
    /**
     * Dependencies used for initialization.
     */
    private readonly dependencies: IMenuBinderFactoryDependencies;

    /**
     * Initializes a new instance of the MenuBinderFactory class.
     *
     * @param dependencies   Dependencies to be used for initialization.
     */
    public constructor(dependencies: IMenuBinderFactoryDependencies) {
        this.dependencies = dependencies;
    }

    /**
     * Creates a new MenuBinder for a size.
     *
     * @param containerSize   Absolute size to create a MenuBinder for.
     * @returns A MenuBinder for the size.
     */
    public createForSize(containerSize: IAbsoluteSizeSchema): MenuBinder {
        return new MenuBinder({
            ...this.dependencies,
            containerSize
        });
    }
}
