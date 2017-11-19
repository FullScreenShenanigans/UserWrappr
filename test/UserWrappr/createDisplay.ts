import { expect } from "chai";

import { IMenu } from "../../src/Menus/Menus";
import { it } from "../main";
import { stubUserWrappr } from "./stubs";

it("adds menu titles to the container", async () => {
    // Arrange
    const menus: IMenu[] = [
        {
            options: [],
            title: "abc"
        },
        {
            options: [],
            title: "def"
        }
    ];
    const { container, userWrapper } = stubUserWrappr({ menus });

    // Act
    await userWrapper.createDisplay();

    // Assert
    expect(container.textContent).to.be.equal("abcdef");
});
