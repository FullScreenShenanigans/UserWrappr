import { stub } from "sinon";

import { ScreenVisibilityToggler } from "../../src/ScreenVisibilityToggler";
import { it } from "../main";

const createDefaultSettings = () => ({
    addDocumentPipe: stub(),
    getPaused: stub().returns(false),
    getVisibilityState: stub().returns("visible"),
    pause: stub(),
    play: stub()
});

it("pauses a playing game when the document hides", () => {
    // Arrange
    const settings = createDefaultSettings();
    const toggler = new ScreenVisibilityToggler(settings);

    settings.getPaused.returns(false);
    settings.getVisibilityState.returns("hidden");

    // Act
    toggler.toggle();

    // Assert
    chai.expect(settings.pause.called).to.be.equal(true);
});

it("doesn't pause a paused game when the document hides", () => {
    // Arrange
    const settings = createDefaultSettings();
    const toggler = new ScreenVisibilityToggler(settings);

    settings.getPaused.returns(true);
    settings.getVisibilityState.returns("hidden");

    // Act
    toggler.toggle();

    // Assert
    chai.expect(settings.play.called).to.be.equal(false);
});

it("doesn't play a playing game when the document becomes visible", () => {
    // Arrange
    const settings = createDefaultSettings();
    const toggler = new ScreenVisibilityToggler(settings);

    settings.getPaused.returns(false);

    // Act
    toggler.toggle();

    // Assert
    chai.expect(settings.play.called).to.be.equal(false);
});

it("doesn't play an externally paused game when the document becomes visible", () => {
    // Arrange
    const settings = createDefaultSettings();
    const toggler = new ScreenVisibilityToggler(settings);

    // Act
    settings.getPaused.returns(true);
    settings.getVisibilityState.returns("visible");
    toggler.toggle();

    // Assert
    chai.expect(settings.play.called).to.be.equal(false);
});

it("plays an intentionally paused game when the document becomes visible", () => {
    // Arrange
    const settings = createDefaultSettings();
    const toggler = new ScreenVisibilityToggler(settings);

    settings.getPaused.returns(false);
    settings.getVisibilityState.returns("hidden");
    toggler.toggle();

    // Act
    settings.getPaused.returns(true);
    settings.getVisibilityState.returns("visible");
    toggler.toggle();

    // Assert
    chai.expect(settings.play.called).to.be.equal(true);
});
