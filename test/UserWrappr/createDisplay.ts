import { expect } from "chai";
import * as sinon from "sinon";

import { IMenu } from "../../src/Menus/Menus";
import { OptionType } from "../../src/Menus/Options/OptionSchemas";
import { formatHtml } from "../html";
import { it } from "../main";
import { stubUserWrappr } from "./stubs";

it("adds a canvas to the container", async () => {
    // Arrange
    const { canvas, container, userWrapper } = stubUserWrappr();

    // Act
    await userWrapper.createDisplay();

    // Assert
    expect(canvas.parentElement).to.be.equal(container);
});

it("mirrors the html generated by the fake menus", async () => {
    // Arrange
    const { canvas, classNames, container, userWrapper } = stubUserWrappr();

    // Act
    await userWrapper.createDisplay();

    // Assert
    expect(container.innerHTML).to.be.equal(formatHtml(`
        <div class="${classNames.outerArea}">
            <div class="${classNames.innerArea}">
            </div>
        </div>
        ${canvas.outerHTML}
    `));
});

it("adds menu titles to the container when given menus", async () => {
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
    const { canvas, classNames, container, userWrapper } = stubUserWrappr({ menus });

    // Act
    await userWrapper.createDisplay();

    // Assert
    expect(container.innerHTML).to.be.equal(formatHtml(`
        <div class="${classNames.outerArea}">
            <div class="${classNames.innerArea}">
                <div class="${classNames.menu} ${classNames.menu}-Closed">
                    <div class="${classNames.options}"></div>
                    <div class="${classNames.menuTitle}">
                        ${menus[0].title}
                    </div>
                </div>
                <div class="${classNames.menu} ${classNames.menu}-Closed">
                    <div class="${classNames.options}"></div>
                    <div class="${classNames.menuTitle}">
                        ${menus[1].title}
                    </div>
                </div>
            </div>
        </div>
        ${canvas.outerHTML}
    `));
});

it("adds an option view when a menu schema contains an option", async () => {
    // Arrange
    const menus: IMenu[] = [
        {
            options: [
                {
                    action: sinon.spy(),
                    title: "action",
                    type: OptionType.Action
                }
            ],
            title: "abc"
        }
    ];
    const { canvas, classNames, container, userWrapper } = stubUserWrappr({ menus });

    // Act
    await userWrapper.createDisplay();

    // Assert
    expect(container.innerHTML).to.be.equal(formatHtml(`
        <div class="${classNames.outerArea}">
            <div class="${classNames.innerArea}">
                <div class="${classNames.menu} ${classNames.menu}-Closed">
                    <div class="${classNames.options}">
                        <button name="action">
                            ${menus[0].options[0].title}
                        </button>
                    </div>
                    <div class="${classNames.menuTitle}">
                        ${menus[0].title}
                    </div>
                </div>
            </div>
        </div>
        ${canvas.outerHTML}
    `));
});
