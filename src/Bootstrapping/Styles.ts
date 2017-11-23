/**
 * Styles for the inner area of the menus container.
 */
export const innerAreaStyle: Partial<CSSStyleDeclaration> = {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
};

/**
 * Styles for each menu.
 */
export const menuStyle: Partial<CSSStyleDeclaration> = {
    flex: "1",
    position: "relative",
    textAlign: "center"
};

/**
 * Styles for each menu's title.
 */
export const menuTitleStyle: Partial<CSSStyleDeclaration> = {
    cursor: "pointer",
    margin: "0"
};

/**
 * Styles for an option's container.
 */
export const optionStyle: Partial<CSSStyleDeclaration> = {
    display: "flex",
    flexDirection: "row",
    flexGrow: "0",
    flexWrap: "wrap"
};

/**
 * Styles for the left half of a two-part option.
 */
export const optionLeftStyle: Partial<CSSStyleDeclaration> = {
    flexGrow: "1",
    width: "50%"
};

/**
 * Styles for the right half of a two-part option.
 */
export const optionRightStyle: Partial<CSSStyleDeclaration> = {
    flexGrow: "1",
    width: "50%"
};

/**
 * Styles for a container of options.
 */
export const optionsStyle: Partial<CSSStyleDeclaration> = {
    bottom: "0",
    marginBottom: "2.1em",
    position: "absolute",
    width: "100%"
};
