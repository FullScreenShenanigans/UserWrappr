import { BrowserClock, createClock, LolexClock } from "lolex";

import { IMenuStoreDependencies, MenuStore } from "../../../src/Menus/MenuStore";

export const stubMenuStore = (dependencies: Partial<IMenuStoreDependencies> = {}) => {
    const clock: LolexClock<number> = createClock<BrowserClock>();
    const setTimeout = clock.setTimeout;
    const title = "abc";
    const transitionTime = 10;
    const fullDependencies = { setTimeout, title, transitionTime, ...dependencies };
    const store = new MenuStore(fullDependencies);

    return { ...fullDependencies, clock, store };
};
