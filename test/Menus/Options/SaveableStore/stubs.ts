import * as sinon from "sinon";

import { OptionType } from "../../../../src/Menus/Options/OptionSchemas";
import { SaveableStore } from "../../../../src/Menus/Options/SaveableStore";

export const stubSaveableStore = () => {
    const initialValue = "abc";
    const getInitialValue = () => initialValue;
    const title = "saveable store";
    const type = OptionType.Boolean;
    const saveValue = sinon.spy();
    const store = new SaveableStore({ getInitialValue, title, type, saveValue });

    return { getInitialValue, title, saveValue, store };
};
