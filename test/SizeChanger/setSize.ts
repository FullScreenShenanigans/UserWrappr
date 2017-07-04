import { stub } from "sinon";

import { SizeChanger } from "../../src/SizeChanger";
import { it } from "../main";

const stubSettings = () => ({
    cancelFullScreen: stub(),
    onReset: stub(),
    requestFullScreen: stub(),
    sizes: {
        full: {
            full: true,
            height: 70,
            width: 140
        },
        tall: {
            height: Infinity,
            width: 210
        },
        wide: {
            height: 280,
            width: Infinity
        }
    }
});

it("resets to a new given size string", () => {
    // Arrange
    const settings = stubSettings();
    const sizeChanger = new SizeChanger(settings);

    // Act
    sizeChanger.setSize("full");

    // Assert
    chai.expect(settings.onReset.lastCall.args).to.be.deep.equal([settings.sizes.full]);
});

it("resets to a new given size summary", () => {
    // Arrange
    const settings = stubSettings();
    const sizeChanger = new SizeChanger(settings);

    // Act
    sizeChanger.setSize(settings.sizes.full);

    // Assert
    chai.expect(settings.onReset.lastCall.args).to.be.deep.equal([settings.sizes.full]);
});

it("resets to a repeated size", () => {
    // Arrange
    const settings = stubSettings();
    const sizeChanger = new SizeChanger(settings);

    // Act
    sizeChanger.setSize("full");
    sizeChanger.setSize("full");

    // Assert
    chai.expect(settings.onReset.lastCall.args).to.be.deep.equal([settings.sizes.full]);
});

it("requests full screen on a full size", () => {
    // Arrange
    const settings = stubSettings();
    const sizeChanger = new SizeChanger(settings);

    // Act
    sizeChanger.setSize(settings.sizes.full);

    // Assert
    chai.expect(settings.requestFullScreen.calledOnce).to.be.equal(true);
});

it("cancels full screen on a non-full size after a full size", () => {
    // Arrange
    const settings = stubSettings();
    const sizeChanger = new SizeChanger(settings);

    sizeChanger.setSize(settings.sizes.full);
    chai.expect(settings.requestFullScreen.calledOnce).to.be.equal(true);

    // Act
    sizeChanger.setSize(settings.sizes.tall);

    // Assert
    chai.expect(settings.cancelFullScreen.calledOnce).to.be.equal(true);
});
