import { expect } from "chai";

import { it } from "../../main";
import { stubMenuStore } from "./stubs";

it("gets the title from dependencies", () => {
    // Arrange
    const { title, store } = stubMenuStore();

    // Act
    const actual = store.title;

    // Assert
    expect(actual).to.be.equal(title);
});
