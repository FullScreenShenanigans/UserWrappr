import { expect } from "chai";

import { createElement } from "../Bootstrapping/CreateElement";
import { stubClassNames, stubStyles } from "../fakes";
import { initializeMenus, IWrappingViewDependencies } from "./InitializeMenus";

const stubWrappingViewDependencies = (partialDependencies: Partial<IWrappingViewDependencies> = {}): IWrappingViewDependencies => {
    const classNames = partialDependencies.classNames === undefined
        ? stubClassNames
        : partialDependencies.classNames;

    return {
        classNames,
        container: createElement("div", {
            className: "stub-container",
            children: [
                createElement("div", {
                    children: [
                        createElement("div", {
                            className: [
                                classNames.menusInnerArea,
                                classNames.menusInnerAreaFake
                            ].join(" ")
                        })
                    ],
                    className: classNames.menusOuterArea,
                })
            ]
        }),
        containerSize: {
            height: 350,
            width: 420
        },
        menus: [],
        styles: stubStyles,
        ...partialDependencies
    };
};

describe("initializeMenus", () => {
    it("replaces the inner area with a non-fake area", async () => {
        // Arrange
        const dependencies = stubWrappingViewDependencies();
        const { classNames, container } = dependencies;

        // Act
        await initializeMenus(dependencies);

        // Assert
        expect(container.children[0].children[0].className).to.be.equal(classNames.menusInnerArea);
    });

    it("renders menu titles when given menu schemas", async () => {
        // Arrange
        const dependencies = stubWrappingViewDependencies({
            menus: [
                {
                    options: [],
                    title: "abc"
                },
                {
                    options: [],
                    title: "def"
                }
            ]
        });
        const { container } = dependencies;

        // Act
        await initializeMenus(dependencies);

        // Assert
        expect(container.textContent).to.be.equal("abcdef");
    });
});
