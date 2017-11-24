import { BrowserClock, createClock, LolexClock } from "lolex";

import { IMenuStoreDependencies, MenuStore } from "../../../src/Menus/MenuStore";
import { stubClassNames } from "../../UserWrappr/stubs";

export const stubMenuStore = (dependencies: Partial<IMenuStoreDependencies> = {}) => {
    const clock: LolexClock<number> = createClock<BrowserClock>();
    const fullDependencies = {
        classNames: stubClassNames,
        setTimeout: clock.setTimeout,
        title: "abc",
        transitionTime: 10,
        ...dependencies
    };
    const store = new MenuStore(fullDependencies);

    return { ...fullDependencies, clock, store };
};
