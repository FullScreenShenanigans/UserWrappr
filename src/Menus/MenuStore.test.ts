import { expect } from "chai";
import { BrowserClock, createClock, LolexClock } from "lolex";

import { stubClassNames, stubStyles } from "../fakes";
import { IMenuStoreDependencies, MenuStore, VisualState } from "./MenuStore";

const stubMenuStore = (dependencies: Partial<IMenuStoreDependencies> = {}) => {
    const clock: LolexClock<number> = createClock<BrowserClock>();
    const fullDependencies = {
        classNames: stubClassNames,
        styles: stubStyles,
        title: "abc",
        ...dependencies
    };
    const store = new MenuStore(fullDependencies);

    return { ...fullDependencies, clock, store };
};

describe("MenuStore", () => {
    describe("close", () => {
        it("keeps the store closed when the store is closed", () => {
            // Arrange
            const { store } = stubMenuStore();

            // Act
            store.close();

            // Assert
            expect(store.visualState).to.be.equal(VisualState.Closed);
        });

        it("closes the store when the store is open", () => {
            // Arrange
            const { store } = stubMenuStore();
            store.open();

            // Act
            store.close();

            // Assert
            expect(store.visualState).to.be.equal(VisualState.Closed);
        });
    });

    describe("open", () => {
        it("opens the store when the store is closed", () => {
            // Arrange
            const { store } = stubMenuStore();

            // Act
            store.open();

            // Assert
            expect(store.visualState).to.be.equal(VisualState.Open);
        });

        it("keeps the store open when the store is open", () => {
            // Arrange
            const { store } = stubMenuStore();
            store.open();

            // Act
            store.open();

            // Assert
            expect(store.visualState).to.be.equal(VisualState.Open);
        });
    });
});
