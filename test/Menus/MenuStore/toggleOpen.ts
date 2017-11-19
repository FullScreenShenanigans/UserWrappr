import { expect } from "chai";

import { VisualState } from "../../../src/Menus/MenuStore";
import { it } from "../../main";
import { stubMenuStore } from "./stubs";

it("starts opening when the store is closed", () => {
    // Arrange
    const { store } = stubMenuStore({});

    // Act
    store.toggleOpen();

    // Assert
    expect(store.visualState).to.be.equal(VisualState.Opening);
});

it("reports an action when the store is closed", () => {
    // Arrange
    const { store } = stubMenuStore({});

    // Act
    const report = store.toggleOpen();

    // Assert
    expect(report).to.be.equal(true);
});

it("finishes opening after its transition time when the store is closed", () => {
    // Arrange
    const { clock, store, transitionTime } = stubMenuStore({});
    store.toggleOpen();

    // Act
    clock.tick(transitionTime);

    // Assert
    expect(store.visualState).to.be.equal(VisualState.Open);
});

it("stays closing when the store is closing", () => {
    // Arrange
    const { clock, store, transitionTime } = stubMenuStore({});
    store.toggleOpen();
    clock.tick(transitionTime);

    // Act
    store.toggleOpen();

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
    const report = store.toggleOpen();

    // Assert
    expect(report).to.be.equal(false);
});

it("starts closing when the store is open", () => {
    // Arrange
    const { clock, store, transitionTime } = stubMenuStore({});
    store.toggleOpen();
    clock.tick(transitionTime);

    // Act
    store.toggleOpen();

    // Assert
    expect(store.visualState).to.be.equal(VisualState.Closing);
});

it("finishes closing after its transition time when the store is open", () => {
    // Arrange
    const { clock, store, transitionTime } = stubMenuStore({});
    store.toggleOpen();
    clock.tick(transitionTime);
    store.toggleOpen();

    // Act
    clock.tick(transitionTime);

    // Assert
    expect(store.visualState).to.be.equal(VisualState.Closed);
});

it("reports an action when the store is open", () => {
    // Arrange
    const { clock, store, transitionTime } = stubMenuStore({});
    store.toggleOpen();
    clock.tick(transitionTime);

    // Act
    const report = store.toggleOpen();

    // Assert
    expect(report).to.be.equal(true);
});

it("stays opening when the store is opening", () => {
    // Arrange
    const { store } = stubMenuStore({});
    store.toggleOpen();

    // Act
    store.toggleOpen();

    // Assert
    expect(store.visualState).to.be.equal(VisualState.Opening);
});

it("reports no action when the store is opening", () => {
    // Arrange
    const { store } = stubMenuStore({});
    store.toggleOpen();

    // Act
    const report = store.toggleOpen();

    // Assert
    expect(report).to.be.equal(false);
});

it("starts closing when the store is pinned open", () => {
    // Arrange
    const { clock, store, transitionTime } = stubMenuStore({});
    store.toggleOpen();
    clock.tick(transitionTime);

    // Act
    store.toggleOpen();

    // Assert
    expect(store.visualState).to.be.equal(VisualState.Closing);
});

it("finishes closing after its transition time when the store is pinned open", () => {
    // Arrange
    const { clock, store, transitionTime } = stubMenuStore({});
    store.toggleOpen();
    clock.tick(transitionTime);
    store.toggleOpen();

    // Act
    clock.tick(transitionTime);

    // Assert
    expect(store.visualState).to.be.equal(VisualState.Closed);
});

it("reports an action when the store is pinned open", () => {
    // Arrange
    const { clock, store, transitionTime } = stubMenuStore({});
    store.toggleOpen();
    clock.tick(transitionTime);

    // Act
    const report = store.toggleOpen();

    // Assert
    expect(report).to.be.equal(true);
});
