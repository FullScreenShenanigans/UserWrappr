// @echo '/// <reference path="DeviceLayr-0.2.0.ts" />'
// @echo '/// <reference path="GamesRunnr-0.2.0.ts" />'
// @echo '/// <reference path="ItemsHoldr-0.2.1.ts" />'
// @echo '/// <reference path="InputWritr-0.2.0.ts" />'
// @echo '/// <reference path="LevelEditr-0.2.0.ts" />'
// @echo '/// <reference path="OptionsGenerator.ts" />'
// @echo '/// <reference path="ButtonsGenerator.ts" />'
// @echo '/// <reference path="LevelEditrGenerator.ts" />'
// @echo '/// <reference path="MapsGridGenerator.ts" />'
// @echo '/// <reference path="TableGenerator.ts" />'

// @ifdef INCLUDE_DEFINITIONS
/// <reference path="References/DeviceLayr-0.2.0.ts" />
/// <reference path="References/GamesRunnr-0.2.0.ts" />
/// <reference path="References/ItemsHoldr-0.2.1.ts" />
/// <reference path="References/InputWritr-0.2.0.ts" />
/// <reference path="References/LevelEditr-0.2.0.ts" />
/// <reference path="UserWrappr.d.ts" />
/// <reference path="OptionsGenerator.ts" />
/// <reference path="ButtonsGenerator.ts" />
/// <reference path="LevelEditrGenerator.ts" />
/// <reference path="MapsGridGenerator.ts" />
/// <reference path="TableGenerator.ts" />
// @endif

// @include ../Source/UserWrappr.d.ts

module UserWrappr {
    "use strict";

    /**
     * A user interface manager made to work on top of GameStartr implementations
     * and provide a configurable HTML display of options.
     */
    export class UserWrappr {
        /**
         * The GameStartr implementation this is wrapping around, such as
         * FullScreenMario or FullScreenPokemon.
         */
        private GameStartrConstructor: IGameStartrConstructor;

        /**
         * The GameStartr instance created by GameStartrConstructor and stored
         * under window.
         */
        private GameStarter: IGameStartr;

        /**
         * A ItemsHoldr used to store UI settings.
         */
        private ItemsHolder: ItemsHoldr.ItemsHoldr;

        /**
         * The settings used to construct the UserWrappr.
         */
        private settings: IUserWrapprSettings;

        /**
         * Custom arguments to be passed to the GameStartr's modules.
         */
        private customs: any;

        /**
         * Help settings specifically for the user interface, obtained from
         * settings.helpSettings.
         */
        private helpSettings: IGameStartrUIHelpSettings;

        /**
         * What the global object is called (typically "window" for browser 
         * environments and "global" for node-style environments).
         */
        private globalName: string;

        /**
         * What to replace with the name of the game in help text settings.
         */
        private gameNameAlias: string;

        /**
         * All the keys the user is allowed to pick from as key bindings.
         */
        private allPossibleKeys: string[];

        /**
         * The allowed sizes for the game.
         */
        private sizes: {
            [i: string]: IUserWrapprSizeSummary
        };

        /**
         * The currently selected size for the game.
         */
        private currentSize: IUserWrapprSizeSummary;

        /**
         * The CSS selector for the HTML element containing GameStarter's container.
         */
        private gameElementSelector: string;

        /**
         * The CSS selector for the HTMl element containing the UI buttons.
         */
        private gameControlsSelector: string;

        /**
         * Whether the game is currently in full screen mode.
         */
        private isFullScreen: boolean;

        /**
         * Whether the page is currently known to be hidden.
         */
        private isPageHidden: boolean;

        /**
         * A utility Function to log messages, commonly console.log.
         */
        private log: (...args: any[]) => string;

        /**
         * Generators used to generate HTML controls for the user.
         */
        private generators: { [i: string]: IOptionsGenerator };

        /**
         * The document element that will contain the game.
         */
        private documentElement: HTMLHtmlElement = <HTMLHtmlElement>document.documentElement;

        /**
         * Identifier for the interval Function checking for device input.
         */
        private deviceChecker: number;

        /**
         * A browser-dependent method for request to enter full screen mode.
         */
        private requestFullScreen: () => void = (
            this.documentElement.requestFullScreen
            || this.documentElement.webkitRequestFullScreen
            || this.documentElement.mozRequestFullScreen
            || (<any>this.documentElement).msRequestFullscreen
            || function (): void {
                console.warn("Not able to request full screen...");
            }
        ).bind(this.documentElement);

        /**
         * A browser-dependent method for request to exit full screen mode.
         */
        private cancelFullScreen: () => void = (
            this.documentElement.cancelFullScreen
            || this.documentElement.webkitCancelFullScreen
            || this.documentElement.mozCancelFullScreen
            || (<any>this.documentElement).msCancelFullScreen
            || function (): void {
                console.warn("Not able to cancel full screen...");
            }
        ).bind(document);

        /**
         * @param {IUserWrapprSettings} settings
         */
        constructor(settings: IUserWrapprSettings) {
            if (typeof settings === "undefined") {
                throw new Error("No settings object given to UserWrappr.");
            }
            if (typeof settings.GameStartrConstructor === "undefined") {
                throw new Error("No GameStartrConstructor given to UserWrappr.");
            }
            if (typeof settings.helpSettings === "undefined") {
                throw new Error("No helpSettings given to UserWrappr.");
            }
            if (typeof settings.globalName === "undefined") {
                throw new Error("No globalName given to UserWrappr.");
            }
            if (typeof settings.sizes === "undefined") {
                throw new Error("No sizes given to UserWrappr.");
            }
            if (typeof settings.sizeDefault === "undefined") {
                throw new Error("No sizeDefault given to UserWrappr.");
            }
            if (typeof settings.schemas === "undefined") {
                throw new Error("No schemas given to UserWrappr.");
            }

            this.settings = settings;
            this.GameStartrConstructor = settings.GameStartrConstructor;
            this.globalName = settings.globalName;
            this.helpSettings = this.settings.helpSettings;

            this.customs = settings.customs || {};

            this.importSizes(settings.sizes);

            this.gameNameAlias = this.helpSettings.globalNameAlias || "{%%%%GAME%%%%}";
            this.gameElementSelector = settings.gameElementSelector || "#game";
            this.gameControlsSelector = settings.gameControlsSelector || "#controls";
            this.log = settings.log || console.log.bind(console);

            this.isFullScreen = false;
            this.setCurrentSize(this.sizes[settings.sizeDefault]);

            this.allPossibleKeys = settings.allPossibleKeys || [
                "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
                "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
                "up", "right", "down", "left", "space", "shift", "ctrl"
            ];

            // Size information is also passed to modules via this.customs
            this.GameStartrConstructor.prototype.proliferate(this.customs, this.currentSize, true);

            this.resetGameStarter(settings, this.customs);
        }

        /**
         * Resets the internal GameStarter by storing it under window, adding
         * InputWritr pipes for input to the page, creating the HTML buttons,
         * and setting additional CSS styles and page visiblity.
         * 
         * @param {IUserWrapprSettings} settings
         * @param {IGameStartrCustoms} customs
         */
        resetGameStarter(settings: IUserWrapprSettings, customs: any = {}): void {
            this.loadGameStarter(this.fixCustoms(customs || {}));

            window[settings.globalName || "GameStarter"] = this.GameStarter;
            this.GameStarter.UserWrapper = this;

            this.loadGenerators();
            this.loadControls(settings.schemas);

            if (settings.styleSheet) {
                this.GameStarter.addPageStyles(settings.styleSheet);
            }

            this.resetPageVisibilityHandlers();

            this.GameStarter.gameStart();

            this.startCheckingDevices();
        }


        /* Simple gets
        */

        /**
         * @return {IGameStartrConstructor} The GameStartr implementation this
         *                                  is wrapping around.
         */
        getGameStartrConstructor(): IGameStartrConstructor {
            return this.GameStartrConstructor;
        }

        /**
         * @return {GameStartr} The GameStartr instance created by GameStartrConstructor
         *                      and stored under window.
         */
        getGameStarter(): IGameStartr {
            return this.GameStarter;
        }

        /**
         * @return {ItemsHoldr} The ItemsHoldr used to store UI settings.
         */
        getItemsHolder(): ItemsHoldr.ItemsHoldr {
            return this.ItemsHolder;
        }

        /**
         * @return {Object} The settings used to construct this UserWrappr.
         */
        getSettings(): IUserWrapprSettings {
            return this.settings;
        }

        /**
         * @return {Object} The customs used to construct the GameStartr.
         */
        getCustoms(): IGameStartrCustoms {
            return this.customs;
        }

        /**
         * @return {Object} The help settings from settings.helpSettings.
         */
        getHelpSettings(): IGameStartrUIHelpSettings {
            return this.helpSettings;
        }

        /**
         * @return {String} What the global object is called, such as "window".
         */
        getGlobalName(): string {
            return this.globalName;
        }

        /**
         * @return {String} What to replace with the name of the game in help
         *                  text settings.
         */
        getGameNameAlias(): string {
            return this.gameNameAlias;
        }

        /**
         * @return {String} All the keys the user is allowed to pick from.
         */
        getAllPossibleKeys(): string[] {
            return this.allPossibleKeys;
        }

        /**
         * @return {Object} The allowed sizes for the game.
         */
        getSizes(): { [i: string]: IUserWrapprSizeSummary } {
            return this.sizes;
        }

        /**
         * @return {Object} The currently selected size for the game.
         */
        getCurrentSize(): IUserWrapprSizeSummary {
            return this.currentSize;
        }

        /**
         * @return {Boolean} Whether the game is currently in full screen mode.
         */
        getIsFullScreen(): boolean {
            return this.isFullScreen;
        }

        /**
         * @return {Boolean} Whether the page is currently known to be hidden.
         */
        getIsPageHidden(): boolean {
            return this.isPageHidden;
        }

        /**
         * @return {Function} A utility Function to log messages, commonly console.log.
         */
        getLog(): (...args: any[]) => string {
            return this.log;
        }

        /**
         * @return {Object} Generators used to generate HTML controls for the user.
         */
        getGenerators(): { [i: string]: IOptionsGenerator } {
            return this.generators;
        }

        /**
         * @return {HTMLHtmlElement} The document element that contains the game.
         */
        getDocumentElement(): HTMLHtmlElement {
            return this.documentElement;
        }

        /**
         * @return {Function} The method to request to enter full screen mode.
         */
        getRequestFullScreen(): () => void {
            return this.requestFullScreen;
        }

        /**
         * @return {Function} The method to request to exit full screen mode.
         */
        getCancelFullScreen(): () => void {
            return this.cancelFullScreen;
        }

        /**
         * @return {Number} The identifier for the device input checking interval.
         */
        getDeviceChecker(): number {
            return this.deviceChecker;
        }


        /* Externally allowed sets
        */

        /**
         * Sets the size of the GameStartr by resetting the game with the size
         * information as part of its customs object. Full screen status is
         * changed accordingly.
         * 
         * @param {Mixed} The size to set, as a String to retrieve the size from
         *                known info, or a container of settings.
         */
        setCurrentSize(size: string | IUserWrapprSizeSummary): void {
            if (typeof size === "string" || size.constructor === String) {
                if (!this.sizes.hasOwnProperty(<string>size)) {
                    throw new Error("Size " + size + " does not exist on the UserWrappr.");
                }
                size = <IUserWrapprSizeSummary>this.sizes[<string>size];
            }

            this.customs = this.fixCustoms(this.customs);

            if ((<IUserWrapprSizeSummary>size).full) {
                this.requestFullScreen();
                this.isFullScreen = true;
            } else if (this.isFullScreen) {
                this.cancelFullScreen();
                this.isFullScreen = false;
            }

            this.currentSize = <IUserWrapprSizeSummary>size;

            if (this.GameStarter) {
                this.GameStarter.container.parentNode.removeChild(this.GameStarter.container);
                this.resetGameStarter(this.settings, this.customs);
            }
        }


        /* Help dialog
        */

        /**
         * Displays the root help menu dialog, which contains all the openings
         * for each help settings opening.
         */
        displayHelpMenu(): void {
            this.helpSettings.openings.forEach(this.logHelpText.bind(this));
        }

        /**
         * Displays the texts of each help settings options, all surrounded by
         * instructions on how to focus on a group.
         */
        displayHelpOptions(): void {
            this.logHelpText(
                "To focus on a group, enter `"
                + this.globalName
                + ".UserWrapper.displayHelpOption(\"<group-name>\");`"
            );

            Object.keys(this.helpSettings.options).forEach(this.displayHelpGroupSummary.bind(this));

            this.logHelpText(
                "\nTo focus on a group, enter `"
                + this.globalName
                + ".UserWrapper.displayHelpOption(\"<group-name>\");`"
            );
        }

        /**
         * Displays the summary for a help group of the given optionName.
         * 
         * @param {String} optionName   The help group to display the summary of.
         */
        displayHelpGroupSummary(optionName: string): void {
            var actions: IGameStartrUIHelpOption[] = this.helpSettings.options[optionName],
                action: IGameStartrUIHelpOption,
                maxTitleLength: number = 0,
                i: number;

            this.log("\n" + optionName);

            for (i = 0; i < actions.length; i += 1) {
                maxTitleLength = Math.max(maxTitleLength, this.filterHelpText(actions[i].title).length);
            }

            for (i = 0; i < actions.length; i += 1) {
                action = actions[i];
                this.log(this.padTextRight(this.filterHelpText(action.title), maxTitleLength) + " ... " + action.description);
            }
        }

        /**
         * Displays the full information on a help group of the given optionName.
         * 
         * @param {String} optionName   The help group to display the information of.
         */
        displayHelpOption(optionName: string): void {
            var actions: IGameStartrUIHelpOption[] = this.helpSettings.options[optionName],
                action: IGameStartrUIHelpOption,
                example: IGameStartrUIHelpExample,
                maxExampleLength: number,
                i: number,
                j: number;

            for (i = 0; i < actions.length; i += 1) {
                action = actions[i];
                maxExampleLength = 0;
                this.logHelpText(action.title + " -- " + action.description);

                if (action.usage) {
                    this.logHelpText(action.usage);
                }

                if (action.examples) {
                    for (j = 0; j < action.examples.length; j += 1) {
                        example = action.examples[j];
                        maxExampleLength = Math.max(
                            maxExampleLength,
                            this.filterHelpText("    " + example.code).length
                        );
                    }

                    for (j = 0; j < action.examples.length; j += 1) {
                        example = action.examples[j];
                        this.logHelpText(
                            this.padTextRight(
                                this.filterHelpText("    " + example.code),
                                maxExampleLength
                            )
                            + "  // " + example.comment
                        );
                    }
                }

                this.log("\n");
            }
        }

        /**
         * Logs a bit of help text, filtered by this.filterHelpText.
         * 
         * @param {String} text   The text to be filtered and logged.
         */
        logHelpText(text: string): void {
            this.log(this.filterHelpText(text));
        }

        /**
         * @param {String} text
         * @return {String} The text, with gamenameAlias replaced by globalName.
         */
        filterHelpText(text: string): string {
            return text.replace(new RegExp(this.gameNameAlias, "g"), this.globalName);
        }

        /**
         * Ensures a bit of text is of least a certain length.
         * 
         * @param {String} text   The text to pad.
         * @param {Number} length   How wide the text must be, at minimum.
         * @return {String} The text with spaces padded to the right.
         */
        padTextRight(text: string, length: number): string {
            var diff: number = 1 + length - text.length;

            if (diff <= 0) {
                return text;
            }

            return text + Array.call(Array, diff).join(" ");
        }


        /* Devices
        */

        /**
         * Starts the checkDevices loop to scan for gamepad status changes.
         */
        private startCheckingDevices(): void {
            this.checkDevices();
        }

        /**
         * Calls the DeviceLayer to check for gamepad triggers, after scheduling
         * another checkDevices call via setTimeout.
         */
        private checkDevices(): void {
            this.deviceChecker = setTimeout(
                this.checkDevices.bind(this),
                this.GameStarter.GamesRunner.getPaused()
                    ? 117
                    : this.GameStarter.GamesRunner.getInterval() / this.GameStarter.GamesRunner.getSpeed());

            this.GameStarter.DeviceLayer.checkNavigatorGamepads();
            this.GameStarter.DeviceLayer.activateAllGamepadTriggers();
        }


        /* Settings parsing
        */

        /**
         * Sets the internal this.sizes as a copy of the given sizes, but with
         * names as members of every size summary.
         * 
         * @param {Object} sizes   The listing of preset sizes to go by.
         */
        private importSizes(sizes: { [i: string]: IUserWrapprSizeSummary }): void {
            var i: string;

            this.sizes = this.GameStartrConstructor.prototype.proliferate({}, sizes);

            for (i in this.sizes) {
                if (this.sizes.hasOwnProperty(i)) {
                    this.sizes[i].name = this.sizes[i].name || i;
                }
            }
        }

        /**
         * 
         */
        private fixCustoms(customsRaw: IGameStartrCustoms): any {
            var customs: IGameStartrCustoms = this.GameStartrConstructor.prototype.proliferate({}, customsRaw);

            this.GameStartrConstructor.prototype.proliferate(customs, this.currentSize);

            if (!isFinite(customs.width)) {
                customs.width = document.body.clientWidth;
            }
            if (!isFinite(customs.height)) {
                if (customs.full) {
                    customs.height = screen.height;
                } else if (this.isFullScreen) {
                    // Guess for browser window...
                    // @todo Actually compute this!
                    customs.height = window.innerHeight - 140;
                } else {
                    customs.height = window.innerHeight;
                }
                // 49px from header, 77px from menus
                customs.height -= 126;
            }

            return customs;
        }


        /* Page visibility
        */

        /**
         * Adds a "visibilitychange" handler to the document bound to 
         * this.handleVisibilityChange.
         */
        private resetPageVisibilityHandlers(): void {
            document.addEventListener("visibilitychange", this.handleVisibilityChange.bind(this));
        }

        /**
         * Handles a visibility change event by calling either this.onPageHidden
         * or this.onPageVisible.
         * 
         * @param {Event} event
         */
        private handleVisibilityChange(event: Event): void {
            switch (document.visibilityState) {
                case "hidden":
                    this.onPageHidden();
                    return;
                case "visible":
                    this.onPageVisible();
                    return;
                default:
                    return;
            }
        }

        /**
         * Reacts to the page becoming hidden by pausing the GameStartr.
         */
        private onPageHidden(): void {
            if (!this.GameStarter.GamesRunner.getPaused()) {
                this.isPageHidden = true;
                this.GameStarter.GamesRunner.pause();
            }
        }

        /**
         * Reacts to the page becoming visible by unpausing the GameStartr.
         */
        private onPageVisible(): void {
            if (this.isPageHidden) {
                this.isPageHidden = false;
                this.GameStarter.GamesRunner.play();
            }
        }


        /* Control section loaders
        */

        /**
         * Loads the internal GameStarter, resetting it with the given customs
         * and attaching handlers to document.body and the holder elements.
         * 
         * @param {Object} customs   Custom arguments to pass to this.GameStarter.
         */
        private loadGameStarter(customs: IGameStartrCustoms): void {
            var section: HTMLElement = <HTMLElement>document.querySelector(this.gameElementSelector);

            if (this.GameStarter) {
                this.GameStarter.GamesRunner.pause();
            }

            this.GameStarter = new this.GameStartrConstructor(customs);

            section.textContent = "";
            section.appendChild(this.GameStarter.container);

            this.GameStarter.proliferate(document.body, {
                "onkeydown": this.GameStarter.InputWriter.makePipe("onkeydown", "keyCode"),
                "onkeyup": this.GameStarter.InputWriter.makePipe("onkeyup", "keyCode")
            });

            this.GameStarter.proliferate(section, {
                "onmousedown": this.GameStarter.InputWriter.makePipe("onmousedown", "which"),
                "oncontextmenu": this.GameStarter.InputWriter.makePipe("oncontextmenu", null, true)
            });
        }

        /**
         * Loads the internal OptionsGenerator instances under this.generators.
         */
        private loadGenerators(): void {
            this.generators = {
                OptionsButtons: new UISchemas.ButtonsGenerator(this),
                OptionsTable: new UISchemas.TableGenerator(this),
                LevelEditor: new UISchemas.LevelEditorGenerator(this),
                MapsGrid: new UISchemas.MapsGridGenerator(this)
            };
        }

        /**
         * Loads the externally facing UI controls and the internal ItemsHolder,
         * appending the controls to the controls HTML element.
         * 
         * @param {Object[]} schemas   The schemas each a UI control to be made.
         */
        private loadControls(schemas: UISchemas.ISchema[]): void {
            var section: HTMLElement = <HTMLElement>document.querySelector(this.gameControlsSelector),
                length: number = schemas.length,
                i: number;

            this.ItemsHolder = new ItemsHoldr.ItemsHoldr({
                "prefix": this.globalName + "::UserWrapper::ItemsHolder"
            });

            section.textContent = "";
            section.className = "length-" + length;

            for (i = 0; i < length; i += 1) {
                section.appendChild(this.loadControlDiv(schemas[i]));
            }
        }

        /** 
         * Creates an individual UI control element based on a UI schema.
         * 
         * @param {Object} schema
         * @return {HTMLDivElement}
         */
        private loadControlDiv(schema: UISchemas.ISchema): HTMLDivElement {
            var control: HTMLDivElement = document.createElement("div"),
                heading: HTMLHeadingElement = document.createElement("h4"),
                inner: HTMLDivElement = document.createElement("div");

            control.className = "control";
            control.id = "control-" + schema.title;

            heading.textContent = schema.title;

            inner.className = "control-inner";
            inner.appendChild(this.generators[schema.generator].generate(schema));

            control.appendChild(heading);
            control.appendChild(inner);

            // Touch events often propogate to children before the control div has
            // been fully extended. Setting the "active" attribute fixes that.
            control.onmouseover = setTimeout.bind(
                undefined,
                function (): void {
                    control.setAttribute("active", "on");
                },
                35);

            control.onmouseout = function (): void {
                control.setAttribute("active", "off");
            };

            return control;
        }
    }
}
