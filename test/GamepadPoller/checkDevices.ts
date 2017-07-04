import { createClock } from "lolex";
import { stub } from "sinon";

import { GamepadPoller } from "../../src/GamepadPoller";
import { it } from "../main";

const stubSettings = () => {
    const clock = createClock();

    return {
        clock,
        getInterval: stub().returns(16),
        getPaused: stub(),
        getSpeed: stub().returns(2),
        pausedDevicePollTime: 20,
        runGamepad: stub(),
        setTimeout: stub()
    };
};

it("runs gamepad logic on a first poll", () => {
    // Arrange
    const settings = stubSettings();
    const poller = new GamepadPoller(settings);

    // Act
    poller.pollDevices();

    // Assert
    chai.expect(settings.runGamepad.calledOnce).to.be.equal(true);
});

it("waits the game rate between polls if the game is playing", () => {
    // Arrange
    const settings = stubSettings();
    const poller = new GamepadPoller(settings);

    settings.getPaused.returns(false);
    poller.pollDevices();

    // Act
    settings.clock.tick(settings.pausedDevicePollTime);

    // Assert
    chai.expect(settings.runGamepad.calledOnce).to.be.equal(true);
});

it("waits the paused poll time between polls if the game is paused", () => {
    // Arrange
    const settings = stubSettings();
    const poller = new GamepadPoller(settings);

    settings.getPaused.returns(true);
    poller.pollDevices();

    // Act
    settings.clock.tick(8);

    // Assert
    chai.expect(settings.runGamepad.calledOnce).to.be.equal(true);
});

it("runs gamepad logic on a second poll despite a first error", () => {
    // Arrange
    const settings = stubSettings();
    const poller = new GamepadPoller(settings);

    settings.getPaused.returns(false);
    settings.runGamepad.throws();

    chai.expect(() => poller.pollDevices()).throw();
    settings.clock.tick(settings.pausedDevicePollTime);

    // Act
    settings.runGamepad.reset();
    poller.pollDevices();

    // Assert
    chai.expect(settings.runGamepad.calledOnce).to.be.equal(true);
});
