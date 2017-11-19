import { createElement } from "../../src/Elements/createElement";
import { IUserWrappr, IUserWrapprSettings } from "../../src/IUserWrappr";
import { IAbsoluteSizeSchema } from "../../src/Sizing";
import { UserWrappr } from "../../src/UserWrappr";

export interface ITestUserWrapprSettings extends IUserWrapprSettings {
    canvas: HTMLCanvasElement;
}

export interface ITestUserWrappr extends ITestUserWrapprSettings {
    userWrapper: IUserWrappr;
}

const stubUserWrapprSettings = (): ITestUserWrapprSettings => {
    const canvas = document.createElement("canvas");

    return {
        canvas,
        container: document.createElement("div"),
        createContents: (container: HTMLElement, size: IAbsoluteSizeSchema) => {
            canvas.height = size.height;
            canvas.width = size.width;
            container.appendChild(canvas);
        },
        createElement,
        defaultSize: {
            height: 350,
            width: 490
        },
        getWindowSize: () => ({
            height: 700,
            width: 840
        }),
        menuClassNames: {
            area: "area",
            title: "title"
        },
        menuInitializer: "../src/Menus/InitializeMenus",
        menus: [],
        requirejs
    };
};

export const stubUserWrappr = (settings: Partial<IUserWrapprSettings> = {}): ITestUserWrappr => {
    const fullSettings: ITestUserWrapprSettings = {
        ...stubUserWrapprSettings(),
        ...settings
    };
    const userWrapper: IUserWrappr = new UserWrappr(fullSettings);

    return { ...fullSettings, userWrapper };
};
