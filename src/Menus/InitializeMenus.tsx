import * as React from "react";
import * as ReactDOM from "react-dom";

import { ICreateWrappingView, IWrappingViewDependencies } from "../Display";
import { Menus } from "./Menus";

export const initializeMenus: ICreateWrappingView = async (dependencies: IWrappingViewDependencies): Promise<void> => {
    await new Promise<void>((resolve) => {
        ReactDOM.render(
            <Menus menus={dependencies.menus} setSize={dependencies.setSize} />,
            dependencies.container,
            resolve);
    });
};
