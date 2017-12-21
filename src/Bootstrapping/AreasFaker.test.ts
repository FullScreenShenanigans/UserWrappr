import { expect } from "chai";

import { stubClassNames, stubStyles } from "../fakes";
import { IAbsoluteSizeSchema } from "../Sizing";
import { AreasFaker, IAreasFakerDependencies } from "./AreasFaker";
import { createElement } from "./CreateElement";

export const stubContainerSize: IAbsoluteSizeSchema = {
    width: 210,
    height: 280
};

const stubDependencies: IAreasFakerDependencies = {
    classNames: stubClassNames,
    container: createElement("div", {
        style: {
            height: `${stubContainerSize.height}px`,
            width: `${stubContainerSize.width}px`
        }
    }),
    createElement,
    menus: [],
    styles: stubStyles,
};

const stubAreasFaker = (partialDependencies: Partial<IAreasFakerDependencies> = {}) =>
    new AreasFaker({
        ...stubDependencies,
        ...partialDependencies
    });

describe("AreasFaker", () => {
    describe("createAndAppendMenuArea", () => {
        it("creates an outer area with the outer area class name", async () => {
            // Arrange
            const areasFaker = stubAreasFaker();

            // Act
            const { menuArea } = await areasFaker.createAndAppendMenuArea(stubContainerSize);

            // Assert
            expect(menuArea.className).to.be.equal(stubClassNames.menusOuterArea);
        });

        it("creates an inner area with the inner area fake class name and styles", async () => {
            // Arrange
            const areasFaker = stubAreasFaker();

            // Act
            const { menuArea } = await areasFaker.createAndAppendMenuArea(stubContainerSize);
            const innerArea = menuArea.children[0] as HTMLElement;

            // Assert
            expect(innerArea.className).to.be.equal([
                stubClassNames.menusInnerArea,
                stubClassNames.menusInnerAreaFake,
            ].join(" "));
            expect(innerArea.style).to.contain({
                ...stubStyles.menusInnerArea,
                ...stubStyles.menusInnerAreaFake
            });
        });

        it("creates stub menu titles when provided menu schemas", async () => {
            // Arrange
            const areasFaker = stubAreasFaker({
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

            // Act
            const { menuArea } = await areasFaker.createAndAppendMenuArea(stubContainerSize);

            // Assert
            expect(menuArea.textContent).to.be.equal("abcdef");
        });
    });

    describe("createContentArea", () => {
        it("vertically fills the content size to the container excluding the menu area", () => {
            // Arrange
            const areasFaker = stubAreasFaker();
            const stubMenuAreaSize: IAbsoluteSizeSchema = {
                height: 140,
                width: 210
            };

            // Act
            const { contentSize } = areasFaker.createContentArea(stubContainerSize, stubMenuAreaSize);

            // Assert
            expect(contentSize).to.be.deep.equal({
                height: stubContainerSize.height - stubMenuAreaSize.height,
                width: stubMenuAreaSize.width,
            });
        });

        it("matches its content area size style to the returned content size", () => {
            // Arrange
            const areasFaker = stubAreasFaker();
            const stubMenuAreaSize: IAbsoluteSizeSchema = {
                height: 140,
                width: 210
            };

            // Act
            const { contentArea, contentSize } = areasFaker.createContentArea(stubContainerSize, stubMenuAreaSize);

            // Assert
            expect(contentArea.style).to.contain({
                height: `${contentSize.height}px`,
                width: `${contentSize.width}px`
            });
        });
    });
});
