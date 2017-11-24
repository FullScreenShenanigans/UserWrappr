import { IAbsoluteSizeSchema } from "../Sizing";

/**
 * Gets how much space is available for a container.
 *
 * @param container   Container element.
 * @returns How much space is available for a container.
 */
export type IGetAvailableContainerSize = (container: HTMLElement) => IAbsoluteSizeSchema;

/**
 * Gets how much space is available for a container.
 *
 * @param container   Container element.
 * @param windowArea   Size of the containing window.
 * @returns How much space is available for a container.
 */
export const getAvailableContainerSize = (container: HTMLElement) => {
    const boundingArea = container.getBoundingClientRect();

    return {
        height: window.innerHeight - boundingArea.top,
        width: boundingArea.width
    };
};
