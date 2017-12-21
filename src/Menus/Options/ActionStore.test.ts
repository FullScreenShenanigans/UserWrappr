import { expect } from "chai";
import { spy } from "sinon";

import { stubClassNames, stubStyles } from "../../fakes";
import { ActionStore } from "./ActionStore";
import { OptionType } from "./OptionSchemas";

const stubActionStore = () => {
    const action = spy();
    const title = "action store";
    const type = OptionType.Action;
    const store = new ActionStore({
        classNames: stubClassNames,
        schema: { action, title, type },
        styles: stubStyles,
    });

    return { action, store };
};

describe("ActionStore", () => {
    describe("activate", () => {
        it("calls the action when activated", () => {
            // Arrange
            const { action, store } = stubActionStore();

            // Act
            store.activate();

            // Assert
            expect(action.calledOnce).to.be.equal(true);
        });
    });
});
