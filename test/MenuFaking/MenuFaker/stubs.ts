import { createElement } from "../../../src/Elements/createElement";
import { IMenuFakerDependencies, MenuFaker } from "../../../src/MenuFaking/MenuFaker";

export interface IMenuFakerStubs extends IMenuFakerDependencies {
    menuFaker: MenuFaker;
}

export const stubDependencies = (): IMenuFakerDependencies => ({
    container: document.createElement("div"),
    containerSize: {
        width: 350,
        height: 490
    },
    createElement,
    classNames: {
        innerArea: "menu-faker-stubs-inner-area",
        options: "menu-faker-stubs-options",
        outerArea: "menu-faker-stubs-outer-area",
        menu: "menu-faker-stubs-menu",
        menuTitle: "menu-faker-stubs-title"
    },
    menus: []
});

export const stubMenuFaker = (dependencies: Partial<IMenuFakerDependencies> = {}): IMenuFakerStubs => {
    const fullDependencies = {
        ...stubDependencies(),
        ...dependencies
    };

    const menuFaker = new MenuFaker(fullDependencies);

    return { ...fullDependencies, menuFaker };
};
