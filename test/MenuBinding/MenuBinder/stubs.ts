import { createElement } from "../../../src/Elements/createElement";
import { IMenuBinderDependencies, MenuBinder } from "../../../src/MenuBinding/MenuBinder";

export interface IMenuBinderStubs extends IMenuBinderDependencies {
    menuBinder: MenuBinder;
}

export const stubDependencies = (): IMenuBinderDependencies => ({
    container: document.createElement("div"),
    containerSize: {
        width: 350,
        height: 490
    },
    createElement,
    menuClassNames: {
        area: "menu-area",
        title: "menu-title"
    },
    menus: []
});

export const stubMenuBinder = (dependencies: Partial<IMenuBinderDependencies> = {}): IMenuBinderStubs => {
    const fullDependencies = {
        ...stubDependencies(),
        ...dependencies
    };

    const menuBinder = new MenuBinder(fullDependencies);

    return { ...fullDependencies, menuBinder };
};
