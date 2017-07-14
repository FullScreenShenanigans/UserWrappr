import { GameStartr } from "gamestartr/lib/GameStartr";

import { ISchema } from "../UISchemas";
import { ButtonsDisplayer } from "./ButtonsDisplayer";
import { MapsGridDisplayer } from "./MapsGridDisplayer";
import { IOptionsDisplayers, IOptionsDisplayerSettings } from "./OptionsDisplayer";
import { TableDisplayer } from "./TableDisplayer";

export interface IHTMLElement extends HTMLElement {
    requestFullScreen: () => void;
    webkitRequestFullScreen: () => void;
    mozRequestFullScreen: () => void;
    msRequestFullscreen: () => void;
    webkitFullscreenElement: () => void;
    cancelFullScreen: () => void;
    webkitCancelFullScreen: () => void;
    mozCancelFullScreen: () => void;
    msCancelFullScreen: () => void;
}

export interface IEvent {
    target: HTMLElement;
}

/**
 * Settings to initialize a new instance of the RootOptionsDisplayer class.
 */
export interface IRootOptionsDisplayerSettings extends IOptionsDisplayerSettings {
    /**
     * Container element to create controls within.
     */
    container: HTMLElement;

    /**
     * GameStartr instance being wrapped around.
     */
    gameStarter: GameStartr;

    /**
     * Schemas for each UI control to be made.
     */
    schemas: ISchema[];

    /**
     * Schedules an callback to be executed after a wait.
     *
     * @param callback   Callback to be executed.
     * @param wait   How long to wait.
     */
    setTimeout: (callback: () => void, wait: number) => void;
}

/**
 * Displays options for the game.
 */
export class RootOptionsDisplayer {
    /**
     * Generators used to generate HTML controls for the user.
     */
    private readonly generators: IOptionsDisplayers;

    /**
     * Settings used for initialization.
     */
    private readonly settings: IRootOptionsDisplayerSettings;

    /**
     * Initializes a new instance of the ControlsDisplayer class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IRootOptionsDisplayerSettings) {
        this.settings = settings;

        this.generators = {
            OptionsButtons: new ButtonsDisplayer(settings),
            OptionsTable: new TableDisplayer(settings),
            MapsGrid: new MapsGridDisplayer(settings)
        };
    }

    /**
     * Resets the visual aspect of the controls.
     */
    public resetControls(): void {
        const previousControls: HTMLElement | null = this.settings.container.querySelector("section");
        if (previousControls) {
            this.settings.container.removeChild(previousControls);
        }

        this.settings.container.appendChild(this.createControlsContainer(this.settings.schemas || []));
    }
    /**
     * Loads the externally facing UI controls and the internal ItemsHolder,
     * appending the controls to the controls HTML element.
     *
     * @param schemas   The schemas for each UI control to be made.
     */
    private createControlsContainer(schemas: ISchema[]): HTMLElement {
        const section: HTMLElement = document.createElement("section");

        section.className = "controls length-" + schemas.length;
        section.textContent = "";

        for (const schema of schemas) {
            section.appendChild(this.createControlDiv(schema));
        }

        return section;
    }

    /**
     * Creates an individual UI control element based on a UI schema.
     *
     * @param schemas   The schemas for a UI control to be made.
     * @returns An individual UI control element.
     */
    private createControlDiv(schema: ISchema): HTMLDivElement {
        const control: HTMLDivElement = document.createElement("div");
        const heading: HTMLHeadingElement = document.createElement("h4");
        const inner: HTMLDivElement = document.createElement("div");

        control.className = "control";
        control.id = "control-" + schema.title;

        heading.textContent = schema.title;

        inner.className = "control-inner";
        inner.appendChild(this.generators[schema.generator].generate(schema));

        control.appendChild(heading);
        control.appendChild(inner);

        // Touch events often propogate to children before the control div has
        // been fully extended. Delaying the "active" attribute fixes that.
        control.onmouseover = (): void => {
            this.settings.setTimeout(
                (): void => control.setAttribute("active", "on"),
                35);
        };

        control.onmouseout = (): void => control.setAttribute("active", "off");

        return control;
    }
}
