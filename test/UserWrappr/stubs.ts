import { BrowserClock, createClock } from "lolex";

import { createElement } from "../../src/Elements/createElement";
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
        classNames: {
            innerArea: "user-wrappr-stubs-inner-area",
            options: "user-wrappr-options",
            outerArea: "user-wrappr-outer-area",
            menu: "user-wrappr-menu",
            menuTitle: "user-wrappr-title"
        },
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
