import { BrowserClock, createClock, LolexClock } from "lolex";

import { IMenuStoreDependencies, MenuStore } from "../../../src/Menus/MenuStore";

export const stubMenuStore = (dependencies: Partial<IMenuStoreDependencies> = {}) => {
    const clock: LolexClock<number> = createClock<BrowserClock>();
    const fullDependencies = {
        classNames: {
            innerArea: "user-wrappr-stubs-inner-area",
            options: "user-wrappr-options",
            outerArea: "user-wrappr-outer-area",
            menu: "user-wrappr-menu",
            menuTitle: "user-wrappr-title"
        },
        setTimeout: clock.setTimeout,
        title: "abc",
        transitionTime: 10,
        ...dependencies
    };
    const store = new MenuStore(fullDependencies);

    return { ...fullDependencies, clock, store };
};
