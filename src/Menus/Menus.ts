import { IOptionSchema } from "../../src/Menus/Options/OptionSchemas";

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
