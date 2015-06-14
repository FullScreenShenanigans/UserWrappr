// @echo '/// <reference path="StatsHoldr-0.2.1.ts" />'
// @echo '/// <reference path="GameStartr-0.2.0.ts" />'

// @ifdef INCLUDE_DEFINITIONS
/// <reference path="References/StatsHoldr-0.2.1.ts" />
/// <reference path="References/GameStartr-0.2.0.ts" />
/// <reference path="UserWrappr.d.ts" />
// @endif

// @include ../Source/UserWrappr.d.ts

module UserWrappr {
    "use strict";

    /**
     * 
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
        private GameStarter: GameStartr.IGameStartr;

        /**
         * A StatsHoldr used to store UI settings.
         */
        private StatsHolder: StatsHoldr.StatsHoldr;

        /**
         * The settings used to construct the UserWrappr.
         */
        private settings: IUserWrapprSettings;

        /**
         * Custom arguments to be passed to the GameStartr's modules.
         */
        private customs: GameStartr.IGameStartrCustoms;

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
         * Whether the game is currently in full screen mode.
         */
        private isFullScreen: boolean;

        /**
         * Whether the page is currently known to be hidden.
         */
        private isPageHidden: boolean;

        /**
         * Generators used to generate HTML controls for the user.
         */
        private generators: { [i: string]: IOptionsGenerator };

        /**
         * A utility Function to log message, commonly console.log.
         */
        private log: (...args: any[]) => string;

        /**
         * The document element that will contain the game.
         */
        private documentElement: HTMLHtmlElement = <HTMLHtmlElement>document.documentElement;

        /**
         * A browser-dependent method for request to enter full screen mode.
         */
        private requestFullScreen: () => void = (
            this.documentElement.requestFullScreen
            || this.documentElement.webkitRequestFullScreen
            || this.documentElement.mozRequestFullScreen
            || this.documentElement.msRequestFullscreen
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
            || this.documentElement.msCancelFullScreen
            || function (): void {
                console.warn("Not able to cancel full screen...");
            }
            ).bind(document);

        /**
         * @param {IUserWrapprSettings} settings
         */
        constructor(settings: IUserWrapprSettings) {
            this.customs = settings.customs || {};

            this.GameStartrConstructor = settings.GameStartrConstructor;
            this.settings = settings;
            this.helpSettings = this.settings.helpSettings;
            this.globalName = settings.globalName;

            this.importSizes(settings.sizes);

            this.gameNameAlias = this.helpSettings.globalNameAlias || "{%%%%GAME%%%%}";
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
         * InputWritr pipes for input to the page, and setting additional CSS
         * styles and page visiblity.
         * 
         * @param {IUserWrapprSettings} settings
         * @param {GameStartr.IGameStartrCustoms} customs
         */
        resetGameStarter(settings: IUserWrapprSettings, customs: GameStartr.IGameStartrCustoms = {}): void {
            this.loadGameStarter(this.fixCustoms(customs || {}));

            window[settings.globalName || "GameStarter"] = this.GameStarter;
            this.GameStarter.UserWrapper = this;

            this.loadGenerators();
            this.loadControls(settings);

            if (settings.styleSheet) {
                this.GameStarter.addPageStyles(settings.styleSheet);
            }

            this.resetPageVisibilityHandlers();

            this.GameStarter.gameStart();
        }


        /* Simple gets
        */

        /**
         * 
         */
        getGameStartrConstructor(): IGameStartrConstructor {
            return this.GameStartrConstructor;
        }

        /**
         * 
         */
        getGameStarter(): GameStartr.IGameStartr {
            return this.GameStarter;
        }

        /**
         * 
         */
        getStatsHolder(): StatsHoldr.StatsHoldr {
            return this.StatsHolder;
        }

        /**
         * 
         */
        getSettings(): IUISettings {
            return this.settings;
        }

        /**
         * 
         */
        getCustoms(): GameStartr.IGameStartrCustoms {
            return this.customs;
        }

        /**
         * 
         */
        getHelpSettings(): IGameStartrUIHelpSettings {
            return this.helpSettings;
        }

        /**
         * 
         */
        getGlobalName(): string {
            return this.globalName;
        }

        /**
         * 
         */
        getGameNameAlias(): string {
            return this.gameNameAlias;
        }

        /**
         * 
         */
        getAllPossibleKeys(): string[] {
            return this.allPossibleKeys;
        }

        /**
         * 
         */
        getSizes(): { [i: string]: IUserWrapprSizeSummary } {
            return this.sizes;
        }

        /**
         * 
         */
        getCurrentSize(): IUserWrapprSizeSummary {
            return this.currentSize;
        }

        /**
         * 
         */
        getIsFullScreen(): boolean {
            return this.isFullScreen;
        }

        /**
         * 
         */
        getIsPageHidden(): boolean {
            return this.isPageHidden;
        }

        /**
         * 
         */
        getLog(): (...args: any[]) => string {
            return this.log;
        }

        /**
         * 
         */
        getDocumentElement(): HTMLHtmlElement {
            return this.documentElement;
        }

        /**
         * 
         */
        getGenerators(): { [i: string]: IOptionsGenerator } {
            return this.generators;
        }

        /**
         * 
         */
        getRequestFullScreen(): () => void {
            return this.requestFullScreen;
        }

        /**
         * 
         */
        getCancelFullScreen(): () => void {
            return this.cancelFullScreen;
        }


        /* Externally allowed sets
        */

        /**
         * 
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


        /* Page visibility
        */

        /**
         * 
         */
        resetPageVisibilityHandlers(): void {
            document.addEventListener("visibilitychange", this.handleVisibilityChange.bind(this));
        }

        /**
         * 
         */
        handleVisibilityChange(event: Event): void {
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
         * 
         */
        onPageHidden(): void {
            if (!this.GameStarter.GamesRunner.getPaused()) {
                this.isPageHidden = true;
                this.GameStarter.GamesRunner.pause();
            }
        }

        /**
         * 
         */
        onPageVisible(): void {
            if (this.isPageHidden) {
                this.isPageHidden = false;
                this.GameStarter.GamesRunner.play();
            }
        }


        /* Help dialog
        */

        /**
         * 
         */
        displayHelpMenu(): void {
            this.helpSettings.openings.forEach(this.logHelpText.bind(this));
        }

        /**
         * 
         */
        displayHelpOptions(): void {
            this.logHelpText(
                "To focus on a group, enter `"
                + this.globalName
                + ".UserWrapper.displayHelpOption(\"<group-name>\");`"
                );

            Object.keys(this.helpSettings.options)
                .forEach(this.displayHelpGroupSummary.bind(this));

            this.logHelpText(
                "\nTo focus on a group, enter `"
                + this.globalName
                + ".UserWrapper.displayHelpOption(\"<group-name>\");`"
                );
        }

        /**
         * 
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
         * 
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
                this.logHelpText(action.title);

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

                this.log("\n");
            }
        }

        /**
         * 
         */
        logHelpText(text: string): void {
            this.log(this.filterHelpText(text));
        }

        /**
         * 
         */
        filterHelpText(text: string): string {
            return text.replace(new RegExp(this.gameNameAlias, "g"), this.globalName);
        }

        /**
         * 
         */
        padTextRight(text: string, length: number): string {
            var diff: number = 1 + length - text.length;

            if (diff <= 0) {
                return text;
            }

            return text + Array.call(Array, diff).join(" ");
        }

        private importSizes(sizes: { [i: string]: IUserWrapprSizeSummary }): void {
            var i: string;

            this.sizes = this.GameStartrConstructor.prototype.proliferate({}, sizes);

            for (i in this.sizes) {
                if (this.sizes.hasOwnProperty(i)) {
                    this.sizes[i].name = this.sizes[i].name || i;
                }
            }
        }


        /* Control section loaders
        */

        /**
         * 
         */
        private loadGameStarter(customs: GameStartr.IGameStartrCustoms): void {
            var section: HTMLElement = document.getElementById("game");

            if (this.GameStarter) {
                this.GameStarter.GamesRunner.pause();
            }

            this.GameStarter = new this.GameStartrConstructor(customs);

            section.textContent = "";
            section.appendChild(this.GameStarter.container);

            // @todo Should everything go onto the section (not document.body)?
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
         * 
         */
        private loadGenerators(): void {
            this.generators = {
                OptionsButtons: new UISchemas.OptionsButtonsGenerator(this),
                OptionsTable: new UISchemas.OptionsTableGenerator(this),
                LevelEditor: new UISchemas.LevelEditorGenerator(this),
                MapsGrid: new UISchemas.MapsGridGenerator(this)
            };
        }

        /**
         * 
         */
        private loadControls(settings: IUISettings): void {
            var section: HTMLElement = document.getElementById("controls"),
                schemas: UISchemas.ISchema[] = settings.schemas,
                length: number = schemas.length,
                i: number;

            this.StatsHolder = new StatsHoldr.StatsHoldr({
                "prefix": this.globalName + "::UserWrapper::StatsHolder",
                "proliferate": this.GameStarter.proliferate,
                "createElement": this.GameStarter.createElement
            });

            section.textContent = "";
            section.className = "length-" + length;

            for (i = 0; i < length; i += 1) {
                section.appendChild(this.loadControlDiv(schemas[i]));
            }
        }

        /** 
         * 
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

        /**
         * 
         */
        private fixCustoms(customsRaw: GameStartr.IGameStartrCustoms): any {
            var customs: GameStartr.IGameStartrCustoms = this.GameStartrConstructor.prototype.proliferate({}, customsRaw);

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
                // 49px from header, 35px from menus
                customs.height -= 84;
            }

            return customs;
        }
    }

    export module UISchemas {
        /**
         * 
         */
        export class AbstractOptionsGenerator {
            /**
             * 
             */
            protected UserWrapper: UserWrappr.UserWrappr;

            /**
             * 
             */
            protected GameStarter: GameStartr.IGameStartr;

            /**
             * @param {UserWrappr} UserWrappr
             */
            constructor(UserWrapper: UserWrappr.UserWrappr) {
                this.UserWrapper = UserWrapper;
                this.GameStarter = this.UserWrapper.getGameStarter();
            }

            /**
             * 
             */
            protected getParentControlDiv(element: HTMLElement): HTMLElement {
                if (element.className === "control") {
                    return element;
                } else if (!element.parentNode) {
                    return undefined;
                }

                return this.getParentControlDiv(element.parentElement);
            }

            /**
             * 
             */
            protected ensureLocalStorageValue(childRaw: IChoiceElement | IChoiceElement[], details: IOption, schema: ISchema): void {
                if (childRaw.constructor === Array) {
                    this.ensureLocalStorageValues(<IInputElement[]>childRaw, details, schema);
                    return;
                }

                var child: IInputElement | ISelectElement = <IInputElement | ISelectElement>childRaw,
                    key: string = schema.title + "::" + details.title,
                    valueDefault: string = details.source.call(this, this.GameStarter).toString(),
                    value: string;

                child.setAttribute("localStorageKey", key);
                this.GameStarter.StatsHolder.addItem(key, {
                    "storeLocally": true,
                    "valueDefault": valueDefault
                });

                value = this.GameStarter.StatsHolder.getItem(key);
                if (value !== "" && value !== child.value) {
                    child.value = value;

                    if (child.setValue) {
                        child.setValue(value);
                    } else if (child.onchange) {
                        child.onchange(undefined);
                    } else if (child.onclick) {
                        child.onclick(undefined);
                    }
                }
            }

            /**
             * 
             */
            protected ensureLocalStorageValues(children: (IInputElement | ISelectElement)[], details: IOption, schema: ISchema): void {
                var keyGeneral: string = schema.title + "::" + details.title,
                    values: any[] = details.source.call(this, this.GameStarter),
                    key: string,
                    value: any,
                    child: IInputElement | ISelectElement,
                    i: number;

                for (i = 0; i < children.length; i += 1) {
                    key = keyGeneral + "::" + i;
                    child = children[i];
                    child.setAttribute("localStorageKey", key);

                    this.GameStarter.StatsHolder.addItem(key, {
                        "storeLocally": true,
                        "valueDefault": values[i]
                    });

                    value = this.GameStarter.StatsHolder.getItem(key);
                    if (value !== "" && value !== child.value) {
                        child.value = value;

                        if (child.onchange) {
                            child.onchange(undefined);
                        } else if (child.onclick) {
                            child.onclick(undefined);
                        }
                    }
                }
            }

            /**
             * 
             */
            protected storeLocalStorageValue(child: IInputElement | ISelectElement, value: any): void {
                var key: string = child.getAttribute("localStorageKey");

                if (key) {
                    this.GameStarter.StatsHolder.setItem(key, value);
                }
            }
        }

        /**
         * 
         */
        export class OptionsButtonsGenerator extends AbstractOptionsGenerator implements IOptionsGenerator {
            generate(schema: IOptionsButtonsSchema): HTMLDivElement {
                var output: HTMLDivElement = document.createElement("div"),
                    options: IOptionsButtonSchema[] = schema.options instanceof Function
                        ? (<IOptionSource>schema.options).call(self, this.GameStarter)
                        : schema.options,
                    optionKeys: string[] = Object.keys(options),
                    keyActive: string = schema.keyActive || "active",
                    classNameStart: string = "select-option options-button-option",
                    scope: OptionsButtonsGenerator = this,
                    option: IOptionsButtonSchema,
                    element: HTMLDivElement,
                    i: number;

                output.className = "select-options select-options-buttons";

                for (i = 0; i < optionKeys.length; i += 1) {
                    option = options[optionKeys[i]];

                    element = document.createElement("div");
                    element.className = classNameStart;
                    element.textContent = optionKeys[i];

                    element.onclick = function (schema: IOptionsButtonSchema, element: HTMLDivElement): void {
                        if (scope.getParentControlDiv(element).getAttribute("active") !== "on") {
                            return;
                        }
                        schema.callback.call(scope, scope.GameStarter, schema, element);

                        if (element.getAttribute("option-enabled") === "true") {
                            element.setAttribute("option-enabled", "0");
                            element.className = classNameStart + " option-disabled";
                        } else {
                            element.setAttribute("option-enabled", "1");
                            element.className = classNameStart + " option-enabled";
                        }
                    }.bind(undefined, schema, element);

                    if (option[keyActive]) {
                        element.className += " option-enabled";
                        element.setAttribute("option-enabled", "1");
                    } else if (schema.assumeInactive) {
                        element.className += " option-disabled";
                        element.setAttribute("option-enabled", "0");
                    } else {
                        element.setAttribute("option-enabled", "1");
                    }

                    output.appendChild(element);
                }

                return output;
            }
        }

        /**
         * 
         */
        export class OptionsTableGenerator extends AbstractOptionsGenerator implements IOptionsGenerator {
            protected optionTypes: IOptionsTableTypes = {
                "Boolean": this.setBooleanInput,
                "Keys": this.setKeyInput,
                "Number": this.setNumberInput,
                "Select": this.setSelectInput,
                "ScreenSize": this.setScreenSizeInput
            };

            generate(schema: IOptionsTableSchema): HTMLDivElement {
                var output: HTMLDivElement = document.createElement("div"),
                    table: HTMLTableElement = document.createElement("table"),
                    option: IOptionsTableOption,
                    action: IOptionsTableAction,
                    row: HTMLTableRowElement | HTMLDivElement,
                    label: HTMLTableDataCellElement,
                    input: HTMLTableDataCellElement,
                    child: IInputElement | ISelectElement,
                    i: number;

                output.className = "select-options select-options-table";

                if (schema.options) {
                    for (i = 0; i < schema.options.length; i += 1) {
                        row = document.createElement("tr");
                        label = document.createElement("td");
                        input = document.createElement("td");

                        option = schema.options[i];

                        label.className = "options-label-" + option.type;
                        label.textContent = option.title;

                        input.className = "options-cell-" + option.type;

                        row.appendChild(label);
                        row.appendChild(input);

                        child = this.optionTypes[schema.options[i].type].call(this, input, option, schema);
                        if (option.storeLocally) {
                            this.ensureLocalStorageValue(child, option, schema);
                        }

                        table.appendChild(row);
                    }
                }

                output.appendChild(table);

                if (schema.actions) {
                    for (i = 0; i < schema.actions.length; i += 1) {
                        row = document.createElement("div");

                        action = schema.actions[i];

                        row.className = "select-option options-button-option";
                        row.textContent = action.title;
                        row.onclick = action.action.bind(this, this.GameStarter);

                        output.appendChild(row);
                    }
                }

                return output;
            }

            protected setBooleanInput(input: IInputElement, details: IOptionsTableBooleanOption, schema: ISchema): IInputElement {
                var status: boolean = details.source.call(this, this.GameStarter),
                    statusClass: string = status ? "enabled" : "disabled",
                    scope: OptionsTableGenerator = this;

                input.className = "select-option options-button-option option-" + statusClass;
                input.textContent = status ? "on" : "off";

                input.onclick = function (): void {
                    input.setValue(input.textContent === "off");
                };

                input.setValue = function (newStatus: string | boolean): void {
                    if (newStatus.constructor === String) {
                        if (newStatus === "false" || newStatus === "off") {
                            newStatus = false;
                        } else if (newStatus === "true" || newStatus === "on") {
                            newStatus = true;
                        }
                    }

                    if (newStatus) {
                        details.enable.call(scope, scope.GameStarter);
                        input.textContent = "on";
                        input.className = input.className.replace("disabled", "enabled");
                    } else {
                        details.disable.call(scope, scope.GameStarter);
                        input.textContent = "off";
                        input.className = input.className.replace("enabled", "disabled");
                    }

                    if (details.storeLocally) {
                        scope.storeLocalStorageValue(input, newStatus.toString());
                    }
                };

                return input;
            }

            protected setKeyInput(input: IInputElement, details: IOptionsTableKeysOption, schema: ISchema): ISelectElement[] {
                var values: string = details.source.call(this, this.GameStarter),
                    children: ISelectElement[] = [],
                    child: ISelectElement,
                    scope: OptionsTableGenerator = this,
                    i: number,
                    j: number;

                for (i = 0; i < values.length; i += 1) {
                    child = <ISelectElement>document.createElement("select");
                    child.className = "options-key-option";

                    for (j = 0; j < this.UserWrapper.getAllPossibleKeys().length; j += 1) {
                        child.appendChild(new Option(this.UserWrapper.getAllPossibleKeys()[j]));
                    }
                    child.value = child.valueOld = values[i].toLowerCase();

                    child.onchange = (function (child: ISelectElement): void {
                        details.callback.call(scope, scope.GameStarter, child.valueOld, child.value);
                        if (details.storeLocally) {
                            scope.storeLocalStorageValue(child, child.value);
                        }
                    }).bind(undefined, child);

                    children.push(child);
                    input.appendChild(child);
                }

                return children;
            }

            protected setNumberInput(input: IInputElement, details: IOptionsTableNumberOption, schema: ISchema): IInputElement {
                var child: IInputElement = <UISchemas.IInputElement>document.createElement("input"),
                    scope: OptionsTableGenerator = this;

                child.type = "number";
                child.value = Number(details.source.call(scope, scope.GameStarter)).toString();
                child.min = (details.minimum || 0).toString();
                child.max = (details.maximum || Math.max(details.minimum + 10, 10)).toString();

                child.onchange = child.oninput = function (): void {
                    if (child.checkValidity()) {
                        details.update.call(scope, scope.GameStarter, child.value);
                    }
                    if (details.storeLocally) {
                        scope.storeLocalStorageValue(child, child.value);
                    }
                };

                input.appendChild(child);

                return child;
            }

            protected setSelectInput(input: ISelectElement, details: IOptionsTableSelectOption, schema: ISchema): ISelectElement {
                var child: ISelectElement = <ISelectElement>document.createElement("select"),
                    options: string[] = details.options(this.GameStarter),
                    scope: OptionsTableGenerator = this,
                    i: number;

                for (i = 0; i < options.length; i += 1) {
                    child.appendChild(new Option(options[i]));
                }

                child.value = details.source.call(scope, scope.GameStarter);

                child.onchange = function (): void {
                    details.update.call(scope, scope.GameStarter, child.value);
                    child.blur();

                    if (details.storeLocally) {
                        scope.storeLocalStorageValue(child, child.value);
                    }
                };

                input.appendChild(child);

                return child;
            }

            protected setScreenSizeInput(input: ISelectElement, details: IOptionsTableScreenSizeOption, schema: ISchema): ISelectElement {
                var scope: OptionsTableGenerator = this,
                    child: ISelectElement;

                details.options = function (): string[] {
                    return Object.keys(scope.UserWrapper.getSizes());
                };

                details.source = function (): IUserWrapprSizeSummary {
                    return scope.UserWrapper.getCurrentSize().name;
                };

                details.update = function (GameStarter: GameStartr.GameStartr, value: IUserWrapprSizeSummary | string): ISelectElement {
                    if (value === scope.UserWrapper.getCurrentSize()) {
                        return undefined;
                    }

                    scope.UserWrapper.setCurrentSize(value);
                };
                child = scope.setSelectInput(input, details, schema);

                return child;
            }
        }

        /**
         * 
         */
        export class LevelEditorGenerator extends AbstractOptionsGenerator implements IOptionsGenerator {
            generate(schema: ISchema): HTMLDivElement {
                var output: HTMLDivElement = document.createElement("div"),
                    title: HTMLDivElement = document.createElement("div"),
                    button: HTMLDivElement = document.createElement("div"),
                    between: HTMLDivElement = document.createElement("div"),
                    uploader: HTMLDivElement = this.createUploaderDiv(),
                    scope: LevelEditorGenerator = this;

                output.className = "select-options select-options-level-editor";

                title.className = "select-option-title";
                title.textContent = "Create your own custom levels:";

                button.className = "select-option select-option-large options-button-option";
                button.innerHTML = "Start the <br /> Level Editor!";
                button.onclick = function (): void {
                    scope.GameStarter.LevelEditor.enable();
                };

                between.className = "select-option-title";
                between.innerHTML = "<em>- or -</em><br />";

                output.appendChild(title);
                output.appendChild(button);
                output.appendChild(between);
                output.appendChild(uploader);

                return output;
            }

            protected createUploaderDiv(): HTMLDivElement {
                var uploader: HTMLDivElement = document.createElement("div"),
                    input: HTMLInputElement = document.createElement("input");

                uploader.className = "select-option select-option-large options-button-option";
                uploader.textContent = "Click to upload and continue your editor files!";
                uploader.setAttribute("textOld", uploader.textContent);

                input.type = "file";
                input.className = "select-upload-input";
                input.onchange = this.handleFileDrop.bind(this, input, uploader);

                uploader.ondragenter = this.handleFileDragEnter.bind(this, uploader);
                uploader.ondragover = this.handleFileDragOver.bind(this, uploader);
                uploader.ondragleave = input.ondragend = this.handleFileDragLeave.bind(this, uploader);
                uploader.ondrop = this.handleFileDrop.bind(this, input, uploader);
                uploader.onclick = input.click.bind(input);

                uploader.appendChild(input);

                return uploader;
            }

            protected handleFileDragEnter(uploader: HTMLDivElement, event: LevelEditr.IDataMouseEvent): void {
                if (event.dataTransfer) {
                    event.dataTransfer.dropEffect = "copy";
                }
                uploader.className += " hovering";
            }

            protected handleFileDragOver(uploader: HTMLElement, event: MouseEvent): boolean {
                event.preventDefault();
                return false;
            }

            protected handleFileDragLeave(element: HTMLElement, event: LevelEditr.IDataMouseEvent): void {
                if (event.dataTransfer) {
                    event.dataTransfer.dropEffect = "none";
                }
                element.className = element.className.replace(" hovering", "");
            }

            protected handleFileDrop(input: HTMLInputElement, uploader: HTMLDivElement, event: LevelEditr.IDataMouseEvent): void {
                var files: FileList = input.files || event.dataTransfer.files,
                    file: File = files[0],
                    reader: FileReader = new FileReader();

                this.handleFileDragLeave(input, event);
                event.preventDefault();
                event.stopPropagation();

                reader.onprogress = this.handleFileUploadProgress.bind(this, file, uploader);
                reader.onloadend = this.handleFileUploadCompletion.bind(this, file, uploader);

                reader.readAsText(file);
            }

            protected handleFileUploadProgress(file: File, uploader: HTMLDivElement, event: LevelEditr.IDataProgressEvent): void {
                var percent: number;

                if (!event.lengthComputable) {
                    return;
                }

                percent = Math.round((event.loaded / event.total) * 100);

                if (percent > 100) {
                    percent = 100;
                }

                uploader.innerText = "Uploading '" + file.name + "' (" + percent + "%)...";
            }

            protected handleFileUploadCompletion(file: File, uploader: HTMLDivElement, event: LevelEditr.IDataProgressEvent): void {
                this.GameStarter.LevelEditor.handleUploadCompletion(event);
                uploader.innerText = uploader.getAttribute("textOld");
            }
        }

        /**
         * 
         */
        export class MapsGridGenerator extends AbstractOptionsGenerator implements IOptionsGenerator {
            generate(schema: IOptionsMapGridSchema): HTMLDivElement {
                var output: HTMLDivElement = document.createElement("div");

                output.className = "select-options select-options-maps-grid";

                if (schema.rangeX && schema.rangeY) {
                    output.appendChild(this.generateRangedTable(schema));
                }

                if (schema.extras) {
                    this.appendExtras(output, schema);
                }

                return output;
            }

            generateRangedTable(schema: IOptionsMapGridSchema): HTMLTableElement {
                var scope: MapsGridGenerator = this,
                    table: HTMLTableElement = document.createElement("table"),
                    rangeX: number[] = schema.rangeX,
                    rangeY: number[] = schema.rangeY,
                    row: HTMLTableRowElement,
                    cell: HTMLTableCellElement,
                    i: number,
                    j: number;

                for (i = rangeY[0]; i <= rangeY[1]; i += 1) {
                    row = document.createElement("tr");
                    row.className = "maps-grid-row";

                    for (j = rangeX[0]; j <= rangeX[1]; j += 1) {
                        cell = document.createElement("td");
                        cell.className = "select-option maps-grid-option maps-grid-option-range";
                        cell.textContent = i + "-" + j;
                        cell.onclick = (function (callback: () => any): void {
                            if (scope.getParentControlDiv(cell).getAttribute("active") === "on") {
                                callback();
                            }
                        }).bind(scope, schema.callback.bind(scope, scope.GameStarter, schema, cell));
                        row.appendChild(cell);
                    }

                    table.appendChild(row);
                }

                return table;
            }

            appendExtras(output: HTMLDivElement, schema: IOptionsMapGridSchema): void {
                var element: HTMLDivElement,
                    extra: IOptionsMapGridExtra,
                    i: string,
                    j: number;

                for (i in schema.extras) {
                    if (!schema.extras.hasOwnProperty(i)) {
                        continue;
                    }

                    extra = schema.extras[i];
                    element = document.createElement("div");

                    element.className = "select-option maps-grid-option maps-grid-option-extra";
                    element.textContent = extra.title;
                    element.setAttribute("value", extra.title);
                    element.onclick = extra.callback.bind(this, this.GameStarter, schema, element);
                    output.appendChild(element);

                    if (extra.extraElements) {
                        for (j = 0; j < extra.extraElements.length; j += 1) {
                            output.appendChild(this.GameStarter.createElement.apply(this.GameStarter, extra.extraElements[j]));
                        }
                    }
                }
            }
        }
    }
}
