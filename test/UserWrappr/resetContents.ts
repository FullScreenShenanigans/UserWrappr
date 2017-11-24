import { expect } from "chai";
import * as sinon from "sinon";

import { IMenuSchema } from "../../src/Menus/MenuSchemas";
import { OptionType } from "../../src/Menus/Options/OptionSchemas";
import { formatHtml } from "../html";
import { it } from "../main";
import { stubUserWrappr } from "./stubs";

it("adds contents to the container", async () => {
    // Arrange
    const { contents, container, userWrapper } = stubUserWrappr();

    // Act
    await userWrapper.createDisplay(container);

    // Assert
    expect(contents.parentElement).to.be.equal(container);
});
