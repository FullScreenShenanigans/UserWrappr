import { expect } from "chai";

import { VisualState } from "../../../src/Menus/MenuStore";
import { it } from "../../main";
import { stubMenuStore } from "./stubs";

it("doesn't pin the menu when the store is closed", () => {
    // Arrange
    const { store } = stubMenuStore({});

    // Act
    store.togglePinned();

    // Assert
    expect(store.visualState).to.be.equal(VisualState.Closed);
});

it("reports no action when the store is closed", () => {
    // Arrange
    const { store } = stubMenuStore({});

    // Act
    const result = store.togglePinned();

    // Assert
    expect(result).to.be.equal(false);
});

it("doesn't pin the menu when the store is closing", () => {
    // Arrange
    const { clock, store, transitionTime } = stubMenuStore({});
    store.toggleOpen();
    clock.tick(transitionTime);
    store.toggleOpen();

    // Act
    store.togglePinned();

    // Assert
    expect(store.visualState).to.be.equal(VisualState.Closing);
});

it("reports no action when the store is closing", () => {
    // Arrange
    const { clock, store, transitionTime } = stubMenuStore({});
    store.toggleOpen();
    clock.tick(transitionTime);
    store.toggleOpen();

    // Act
    const result = store.togglePinned();

    // Assert
    expect(result).to.be.equal(false);
});

it("pins when the store is open", () => {
    // Arrange
    const { clock, store, transitionTime } = stubMenuStore({});
    store.toggleOpen();
    clock.tick(transitionTime);

    // Act
    store.togglePinned();

    // Assert
    expect(store.visualState).to.be.equal(VisualState.PinnedOpen);
});

it("reports an action when the store is open", () => {
    // Arrange
    const { clock, store, transitionTime } = stubMenuStore({});
    store.toggleOpen();
    clock.tick(transitionTime);

    // Act
    const result = store.togglePinned();

    // Assert
    expect(result).to.be.equal(true);
});
