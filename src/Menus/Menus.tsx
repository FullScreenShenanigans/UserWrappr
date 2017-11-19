import * as React from "react";

import { IOptionSchema } from "../../src/Menus/Options/OptionSchemas";
import { ISetSize } from "../Display";

/**
 * Schema for a menu containing options.
 */
export interface IMenu {
    /**
     * Options within the menu.
     */
    options: IOptionSchema[];

    /**
     * Identifying menu title.
     */
    title: string;
}

/**
 * Props for a Menus component.
 */
export interface IMenusProps {
    /**
     * Menu schemas to render.
     */
    menus: IMenu[];

    /**
     * Hook to reset contents to a size.
     */
    setSize: ISetSize;
}

export const Menus = (props: IMenusProps) => {
    return <span>{JSON.stringify(props)}</span>;
};
