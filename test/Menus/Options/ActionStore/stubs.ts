import * as sinon from "sinon";

import { ActionStore } from "../../../../src/Menus/Options/ActionStore";
import { OptionType } from "../../../../src/Menus/Options/OptionSchemas";

export const stubActionStore = () => {
    const action = sinon.spy();
    const title = "action store";
    const type = OptionType.Action;
    const store = new ActionStore({ action, title, type });

    return { action, store };
};
