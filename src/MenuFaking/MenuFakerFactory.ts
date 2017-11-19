import { IClassNames } from "../Display";
import { ICreateElement } from "../Elements/createElement";
import { IMenu } from "../Menus/Menus";
import { IAbsoluteSizeSchema } from "../Sizing";
import { MenuFaker } from "./MenuFaker";

/**
 * Dependencies to initialize a new MenuFakerFactory.
 */
export interface IMenuFakerFactoryDependencies {
    /**
     * Class names to use for display elements.
     */
    classNames: IClassNames;

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
}

/**
 * Creates MenuFakers for containers.
 */
export class MenuFakerFactory {
    /**
     * Dependencies used for initialization.
     */
    private readonly dependencies: IMenuFakerFactoryDependencies;

    /**
     * Initializes a new instance of the MenuFakerFactory class.
     *
     * @param dependencies   Dependencies to be used for initialization.
     */
    public constructor(dependencies: IMenuFakerFactoryDependencies) {
        this.dependencies = dependencies;
    }

    /**
     * Creates a new MenuFaker for a size.
     *
     * @param containerSize   Absolute size to create a MenuFaker for.
     * @returns A MenuFaker for the size.
     */
    public createForSize(containerSize: IAbsoluteSizeSchema): MenuFaker {
        return new MenuFaker({
            ...this.dependencies,
            containerSize
        });
    }
}
