import { BrowserClock, createClock } from "lolex";

import { createElement } from "../../src/Elements/CreateElement";
import { IOptionalUserWrapprSettings, IRequiredUserWrapprSettings, IUserWrappr, IUserWrapprSettings } from "../../src/IUserWrappr";
import { IAbsoluteSizeSchema } from "../../src/Sizing";
import { UserWrappr } from "../../src/UserWrappr";

export interface ITestUserWrapprSettings extends IOptionalUserWrapprSettings, IRequiredUserWrapprSettings {
    contents: Element;
    clock: BrowserClock;
}

export interface ITestUserWrappr extends ITestUserWrapprSettings {
    container: HTMLElement;
    userWrapper: IUserWrappr;
}

export const stubClassNames = {
    innerArea: "user-wrappr-stubs-inner-area",
    option: "user-wrappr-stubs-option",
    optionLeft: "user-wrappr-stubs-option-left",
    optionRight: "user-wrappr-stubs-option-right",
    options: "user-wrappr-stubs-options",
    outerArea: "user-wrappr-stubs-outer-area",
    menu: "user-wrappr-stubs-menu",
    menuTitle: "user-wrappr-stubs-menu-title"
};

const stubUserWrapprSettings = (): ITestUserWrapprSettings => {
    const contents = document.createElement("canvas");
    const clock = createClock<BrowserClock>();

    return {
        contents,
        clock,
        createContents: (size: IAbsoluteSizeSchema) => {
            contents.height = size.height;
            contents.width = size.width;
            return contents;
        },
        createElement,
        defaultSize: {
            height: 350,
            width: 490
        },
        getAvailableContainerSize: () => ({
            height: 700,
            width: 840
        }),
        classNames: stubClassNames,
        menuInitializer: "../src/Menus/InitializeMenus",
        menus: [],
        setTimeout: clock.setTimeout,
        requirejs,
        transitionTime: 350
    };
};

export const stubUserWrappr = (settings: Partial<IUserWrapprSettings> = {}): ITestUserWrappr => {
    const fullSettings: ITestUserWrapprSettings = {
        ...stubUserWrapprSettings(),
        ...settings
    };
    const container = document.createElement("div");
    const userWrapper: IUserWrappr = new UserWrappr(fullSettings);

    return { ...fullSettings, container, userWrapper };
};
