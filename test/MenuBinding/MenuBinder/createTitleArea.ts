import { expect } from "chai";

import { it } from "../../main";
import { stubMenuBinder } from "./stubs";

const getContainerArea = (container: HTMLElement) => container.children[0];

it("creates a blank area when no menus are given", async () => {
    // Arrange
    const { container, menuBinder } = stubMenuBinder();

    // Act
    await menuBinder.createTitleArea();

    // Assert
    expect(getContainerArea(container).children).to.have.length(0);
});

it("assigns the area class name to the area element", async () => {
    // Arrange
    const { container, menuBinder, menuClassNames } = stubMenuBinder();

    // Act
    await menuBinder.createTitleArea();

    // Assert
    expect(getContainerArea(container).className).to.be.equal(menuClassNames.area);
});

it("creates an area with a title when one menu is given", async () => {
    // Arrange
    const title = "stub";
    const { container, menuBinder } = stubMenuBinder({
        menus: [
            {
                options: [],
                title
            }
        ]
    });

    // Act
    await menuBinder.createTitleArea();

    // Assert
    expect(getContainerArea(container).children[0].textContent).to.be.equal(title);
});

it("assigns the title class name to a created title element", async () => {
    // Arrange
    const title = "stub";
    const { container, menuBinder, menuClassNames } = stubMenuBinder({
        menus: [
            {
                options: [],
                title
            }
        ]
    });

    // Act
    await menuBinder.createTitleArea();

    // Assert
    expect(getContainerArea(container).children[0].className).to.be.equal(menuClassNames.title);
});

it("creates an area with two title when two menus are given", async () => {
    // Arrange
    const titles = ["abc", "def"];
    const { container, menuBinder } = stubMenuBinder({
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
    await menuBinder.createTitleArea();

    // Assert
    expect(getContainerArea(container).children[0].textContent).to.be.equal(titles[0]);
    expect(getContainerArea(container).children[1].textContent).to.be.equal(titles[1]);
});

it("returns a reduced container size for an area with size", async () => {
    // Arrange
    const outerHeight = 700;
    const outerWidth = 840;
    const innerHeight = 350;
    const innerWidth = 490;
    const { menuBinder } = stubMenuBinder({
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
    const size = await menuBinder.createTitleArea();

    // Assert
    expect(size).to.be.deep.equal({
        height: outerHeight - innerHeight,
        width: outerWidth - innerWidth
    });
});
