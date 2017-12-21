import { expect } from "chai";
import { spy } from "sinon";

import { stubClassNames, stubStyles } from "../../fakes";
import { ISaveableSchema, OptionType } from "./OptionSchemas";
import { SaveableStore } from "./SaveableStore";

const stubSaveableStore = () => {
    const initialValue = "abc";
    const getInitialValue = () => initialValue;
    const title = "saveable store";
    const type = OptionType.Boolean;
    const saveValue = spy();
    const store = new SaveableStore<ISaveableSchema<string>, string>({
        classNames: stubClassNames,
        schema: { getInitialValue, title, type, saveValue },
        styles: stubStyles,
    });

    return { getInitialValue, title, saveValue, store };
};

describe("SaveableStore", () => {
    it("sets the state on the store when given an initial state", () => {
        // Arrange
        const { getInitialValue, store } = stubSaveableStore();

        // Act
        const actualInitialValue = store.value;

        // Assert
        expect(actualInitialValue).to.be.equal(getInitialValue());
    });

    describe("setValue", () => {
        it("sets the state on the store when given a new state", () => {
            // Arrange
            const { store } = stubSaveableStore();
            const newState = "def";

            // Act
            store.setValue(newState);

            // Assert
            expect(store.value).to.be.equal(newState);
        });

        it("saves the state when given a new state", () => {
            // Arrange
            const { getInitialValue, saveValue, store } = stubSaveableStore();
            const oldValue = getInitialValue();
            const newValue = "def";

            // Act
            store.setValue(newValue);

            // Assert
            expect(saveValue).to.have.been.calledWithExactly(newValue, oldValue);
        });
    });
});
