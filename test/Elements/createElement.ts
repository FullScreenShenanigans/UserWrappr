import { expect } from "chai";

import { createElement } from "../../src/Elements/CreateElement";
import { it } from "../main";

it("creates an element when given a tag name", () => {
    // Arrange
    const tagName = "div";

    // Act
    const element = createElement(tagName);

    // Assert
    expect(element.tagName).to.be.equal("DIV");
});

it("appends children to the element when given children", () => {
    // Arrange
    const children = [
        createElement("p"),
        createElement("span")
    ];

    // Act
    const element = createElement("div", { children });

    // Assert
    expect([].slice.call(element.children)).to.be.deep.equal(children);
});

it("sets the className of the element when given a className", () => {
    // Arrange
    const className = "abc def";

    // Act
    const element = createElement("div", { className });

    // Assert
    expect(element.className).to.be.equal(className);
});

it("sets the textContent of the element when given a textContent", () => {
    // Arrange
    const textContent = "abc def";

    // Act
    const element = createElement("div", { textContent });

    // Assert
    expect(element.textContent).to.be.equal(textContent);
});
