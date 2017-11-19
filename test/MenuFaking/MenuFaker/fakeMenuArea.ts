import { expect } from "chai";

import { formatHtml } from "../../html";
import { it } from "../../main";
import { stubMenuFaker } from "./stubs";

it("creates a blank area when no menus are given", async () => {
    // Arrange
    const { classNames, container, menuFaker } = stubMenuFaker();

    // Act
    await menuFaker.fakeMenuArea();

    // Assert
    expect(container.innerHTML).to.be.equal([
        `<div class="${classNames.outerArea}">`,
        `<div class="${classNames.innerArea}">`,
        "</div>",
        "</div>"
    ].join(""));
});

it("creates an area with a title when one menu is given", async () => {
    // Arrange
    const title = "stub";
    const { classNames, container, menuFaker } = stubMenuFaker({
        menus: [
            {
                options: [],
                title
            }
        ]
    });

    // Act
    await menuFaker.fakeMenuArea();

    // Assert
    expect(container.innerHTML).to.be.equal(formatHtml(`
        <div class="${classNames.outerArea}">
            <div class="${classNames.innerArea}">
                <div class="${classNames.menu}">
                    <div class="${classNames.menuTitle}">
                        ${title}
                    </div>
                </div>
            </div>
        </div>
    `));
});

it("creates an area with two titles when two menus are given", async () => {
    // Arrange
    const titles = ["abc", "def"];
    const { classNames, container, menuFaker } = stubMenuFaker({
        menus: [
            {
                options: [],
                title: titles[0]
            },
            {
                options: [],
                title: titles[1]
            }
        ]
    });

    // Act
    await menuFaker.fakeMenuArea();

    // Assert
    expect(container.innerHTML).to.be.equal(formatHtml(`
        <div class="${classNames.outerArea}">
            <div class="${classNames.innerArea}">
                <div class="${classNames.menu}">
                    <div class="${classNames.menuTitle}">
                        ${titles[0]}
                    </div>
                </div>
                <div class="${classNames.menu}">
                    <div class="${classNames.menuTitle}">
                        ${titles[1]}
                    </div>
                </div>
            </div>
        </div>
    `));
});

it("returns a reduced container size for an area with size", async () => {
    // Arrange
    const outerHeight = 700;
    const outerWidth = 840;
    const innerHeight = 350;
    const innerWidth = 490;
    const { menuFaker } = stubMenuFaker({
        containerSize: {
            height: outerHeight,
            width: outerWidth
        },
        createElement: () => {
            const element = document.createElement("div");
            const clientRect = {
                height: innerHeight,
                width: innerWidth
            };

            element.getBoundingClientRect = () => clientRect as ClientRect;

            return element;
        }
    });

    // Act
    const size = await menuFaker.fakeMenuArea();

    // Assert
    expect(size).to.be.deep.equal({
        height: outerHeight - innerHeight,
        width: outerWidth - innerWidth
    });
});
