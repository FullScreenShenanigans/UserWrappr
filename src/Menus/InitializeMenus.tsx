import * as React from "react";
import * as ReactDOM from "react-dom";

import { IWrappingViewDependencies } from "../Display";
import { Menus } from "./Menus";
import { MenusStore } from "./MenusStore";

/**
 * Creates a menus view in a container.
 *
 * @param container   Container to create a view within.
 * @param schema   Descriptions of menu options.
 */
export type IInitializeMenusView = (dependencies: IWrappingViewDependencies) => Promise<void>;

/**
 * Module containing initializeMenus.
 *
 * @remarks This should match the module naming of this file.
 */
export interface IInitializeMenusViewWrapper {
    /**
     * Creates a menus view in a container.
     */
    initializeMenus: IInitializeMenusView;
}

/**
 * Creates a menus view in a container.
 *
 * @param dependencies   Dependencies to create the menus view.
 * @returns A Promise for creating a menus view in the container.
 */
export const initializeMenus: IInitializeMenusView = async (dependencies: IWrappingViewDependencies): Promise<void> => {
    const store = new MenusStore({
        classNames: dependencies.classNames,
        menus: dependencies.menus,
        setTimeout: dependencies.setTimeout,
        setSize: dependencies.setSize,
        transitionTime: dependencies.transitionTime
    });

    const menusContainerQuery = `.${dependencies.classNames.innerArea}`;
    const menusContainer = dependencies.container.querySelector(menusContainerQuery);

    await new Promise<void>((resolve) => {
        ReactDOM.render(
            <Menus store={store} />,
            menusContainer,
            resolve);
    });
};
