import { expect } from "chai";

import { getAbsoluteSizeFromSchema, IAbsoluteSizeSchema, IRelativeSizeSchema } from "../../src/Sizing";
import { it } from "../main";

it("keeps pixel sizes the same when given pixel sizes", () => {
    // Arrange
    const container: IAbsoluteSizeSchema = {
        height: 490,
        width: 350
    };
    const requestedSize: IRelativeSizeSchema = {
        height: 350,
        width: 490,
    };

    // Act
    const absoluteSize: IAbsoluteSizeSchema = getAbsoluteSizeFromSchema(container, requestedSize);

    // Assert
    expect(absoluteSize).to.be.deep.equal(requestedSize);
});

it("calculates percentages when given percentage strings", () => {
    // Arrange
    const container: IAbsoluteSizeSchema = {
        height: 490,
        width: 350
    };
    const requestedSize: IRelativeSizeSchema = {
        height: "50%",
        width: "100%",
    };

    // Act
    const absoluteSize: IAbsoluteSizeSchema = getAbsoluteSizeFromSchema(container, requestedSize);

    // Assert
    expect(absoluteSize).to.be.deep.equal({
        height: 245,
        width: 350
    });
});
