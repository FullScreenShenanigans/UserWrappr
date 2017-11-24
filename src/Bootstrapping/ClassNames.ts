/**
 * Class names to use for display elements.
 */
export interface IClassNames {
    /**
     * Class name for the inner area div.
     */
    innerArea: string;

    /**
     * Class name for a faked inner area div.
     */
    innerAreaFake: string;

    /**
     * Class name for each menu's div.
     */
    menu: string;

    /**
     * Class name for each menu's children container.
     */
    menuChildren: string;

    /**
     * Class name for each menu title div.
     */
    menuTitle: string;

    /**
     * Class name for an option's container.
     */
    option: string;

    /**
     * Class name for the left half of a two-part option.
     */
    optionLeft: string;

    /**
     * Class name for the right half of a two-part option.
     */
    optionRight: string;

    /**
     * Class name for each options container div.
     */
    options: string;

    /**
     * Class name for each options list within its container.
     */
    optionsList: string;

    /**
     * Class name for the surrounding area div.
     */
    outerArea: string;
}

/**
 * Default class names to use for display elements.
 */
export const defaultClassNames: IClassNames = {
    innerArea: "menus-inner-area",
    innerAreaFake: "menus-inner-area-fake",
    menu: "menu",
    menuChildren: "menu-children",
    menuTitle: "menu-title",
    option: "option",
    optionLeft: "option-left",
    optionRight: "option-right",
    options: "options",
    optionsList: "options-list",
    outerArea: "menus-outer-area"
};
