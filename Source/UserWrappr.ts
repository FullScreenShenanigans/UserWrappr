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
    class UserWrappr {
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
         * A utility Function to log message, commonly console.log.
         */
        private log: (...args: any[]) => string;

        /**
         * The document element that will contain the game.
         */
        private documentElement = <HTMLHtmlElement>document.documentElement;

        /**
         * Generators used to generate HTML controls for the user.
         */
        private generators: { [i: string]: IOptionsGenerator } = {
            OptionsButtons: new OptionsButtonsGenerator(this),
            OptionsTable: new OptionsTableGenerator(this),
            LevelEditor: new LevelEditorGenerator(this),
            MapsGrid: new MapsGridGenerator(this)
        };

        /**
         * A browser-dependent method for request to enter full screen mode.
         */
        private requestFullScreen: () => void = (
            this.documentElement.requestFullScreen
            || this.documentElement.webkitRequestFullScreen
            || this.documentElement.mozRequestFullScreen
            || this.documentElement.msRequestFullscreen
            || function () {
                console.warn("Not able to request full screen...");
            }
            ).bind(this.documentElement);
        
        /**
         * A browser-dependent method for request to exit full screen mode.
         */
        private cancelFullScreen = (
            this.documentElement.cancelFullScreen
            || this.documentElement.webkitCancelFullScreen
            || this.documentElement.mozCancelFullScreen
            || this.documentElement.msCancelFullScreen
            || function () {
                console.warn("Not able to cancel full screen...");
            }
            ).bind(document);
    
        /**
         * @param {IUserWrapprSettings} settings
         */
        constructor(settings: IUserWrapprSettings) {
            this.customs = settings.customs || {};

            this.GameStartrConstructor = settings.GameStartrConstructor;
            this.helpSettings = settings.helpSettings;
            this.globalName = settings.globalName;
            this.sizes = settings.sizes;

            this.gameNameAlias = this.helpSettings.globalNameAlias || "{%%%%GAME%%%%}";
            this.currentSize = this.sizes[settings.sizeDefault];
            this.log = settings.log || console.log.bind(console);

            this.isFullScreen = false;

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
            var interfaceSettings: IGameStartrUISettings = <IGameStartrUISettings>this.GameStarter.settings["ui"];

            this.loadGameStarter(this.fixCustoms(customs || {}));
            this.loadControls(settings);

            window[settings.globalName || "GameStarter"] = this.GameStarter;
            this.GameStarter.UserWrapper = self;

            if (interfaceSettings.styleSheet) {
                this.GameStarter.addPageStyles(interfaceSettings.styleSheet);
            }

            this.resetPageVisibilityHandlers();
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
        getSettings(): IUserWrapprSettings {
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

            this.GameStarter.container.parentNode.removeChild(this.GameStarter.container);
            this.resetGameStarter(this.settings, this.customs);
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
            }
        }
    
        /**
         * 
         */
        onPageHidden(): void {
            if (!this.GameStarter.GamesRunner.getPaused()) {
                this.GameStarter.MapScreener.pageHidden = true;
                this.GameStarter.GamesRunner.pause();
            }
        }
    
        /**
         * 
         */
        onPageVisible(): void {
            if (this.GameStarter.MapScreener.pageHidden) {
                this.GameStarter.MapScreener.pageHidden = false;
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
                + ".UserWrapper.displayHelpOption(<group-name>);`"
                );

            Object.keys(this.helpSettings.options)
                .forEach(this.displayHelpGroupSummary.bind(this));

            this.logHelpText(
                "\nTo focus on a group, enter `"
                + this.globalName
                + ".UserWrapper.displayHelpOption(<group-name>);`"
                );
        }
    
        /**
         * 
         */
        displayHelpGroupSummary(optionName: string): void {
            var actions = this.helpSettings.options[optionName],
                strings = [],
                maxTitleLength = 0,
                action, i;

            this.log("\n" + optionName);

            for (i = 0; i < actions.length; i += 1) {
                maxTitleLength = Math.max(maxTitleLength, this.filterHelpText(actions[i].title).length);
            }

            for (i = 0; i < actions.length; i += 1) {
                action = actions[i];
                this.log(
                    this.padTextRight(this.filterHelpText(action.title), maxTitleLength)
                    + " ... " + action.description);
            }
        }
    
        /**
         * 
         */
        displayHelpOption(optionName: string): void {
            var actions = this.helpSettings.options[optionName],
                action, maxExampleLength, example, i, j;

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
            var diff = 1 + length - text.length;

            if (diff <= 0) {
                return text;
            }

            return text + Array.call(Array, diff).join(" ");
        }
    
    
        /* Control section loaders
        */
    
        /**
         * 
         */
        loadGameStarter(customs): void {
            var section = document.getElementById("game");

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

            this.GameStarter.gameStart();
        }
    
        /**
         * 
         */
        loadControls(settings): void {
            var section = document.getElementById("controls"),
                schemas = settings.schemas,
                length = schemas.length,
                i;

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
        loadControlDiv(schema): HTMLDivElement {
            var control = document.createElement("div"),
                heading = document.createElement("h4"),
                inner = document.createElement("div");

            control.className = "control";
            control.id = "control-" + schema.title;

            heading.textContent = schema.title;

            inner.className = "control-inner";
            inner.appendChild(this.generators[schema.generator].generate(schema));

            control.appendChild(heading);
            control.appendChild(inner);
        
            // Touch events often propogate to children before the control div has
            // been fully extended. Setting the "active" attribute fixes that.
            control.onmouseover = setTimeout.bind(undefined, function () {
                control.setAttribute("active", "on");
            }, 35);

            control.onmouseout = function () {
                control.setAttribute("active", "off");
            };

            return control;
        }
    
        /* Utilities
        */
    
        /**
         * 
         */
        ensureLocalStorageValue(child, details, schema): void {
            if (child.constructor === Array) {
                this.ensureLocalStorageValues(child, details, schema);
                return;
            }

            var key: string = schema.title + "::" + details.title,
                valueDefault: string = details.source.call(this, this.GameStarter).toString(),
                value: string;

            child.setAttribute("localStorageKey", key);
            this.StatsHolder.addItem(key, {
                "storeLocally": true,
                "valueDefault": valueDefault
            });

            value = this.StatsHolder.getItem(key);
            if (value !== "" && value !== child.value) {
                child.value = value;

                if (child.setValue) {
                    child.setValue(value);
                } else if (child.onchange) {
                    child.onchange();
                } else if (child.onclick) {
                    child.onclick();
                }
            }
        }
    
        /**
         * 
         */
        ensureLocalStorageValues(children, details, schema): void {
            var keyGeneral = schema.title + "::" + details.title,
                values = details.source.call(this, this.GameStarter),
                settings = {
                    "storeLocally": true
                },
                key, child, value, i;

            for (i = 0; i < children.length; i += 1) {
                key = keyGeneral + "::" + i;
                child = children[i];
                child.setAttribute("localStorageKey", key);

                this.StatsHolder.addItem(key, {
                    "storeLocally": true,
                    "valueDefault": values[i]
                });

                value = this.StatsHolder.getItem(key);
                if (value !== "" && value !== child.value) {
                    child.value = value;

                    if (child.onchange) {
                        child.onchange();
                    } else if (child.onclick) {
                        child.onclick();
                    }
                }
            }
        }
    
        /**
         * 
         */
        storeLocalStorageValue(child, value): void {
            var key: string = child.getAttribute("localStorageKey");

            if (key) {
                this.StatsHolder.setItem(key, value);
            }
        }
    
    
        /**
         * 
         */
        fixCustoms(customsRaw): any {
            var customs = this.GameStartrConstructor.prototype.proliferate({}, customsRaw);

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

        getParentControlDiv(element): HTMLElement {
            if (element.className === "control") {
                return element;
            } else if (!element.parentNode) {
                return undefined;
            }
            return this.getParentControlDiv(element.parentNode);
        }
    }

    /**
     * 
     */
    class AbstractOptionsGenerator {
        protected UserWrapper: UserWrappr;

        protected GameStarter: GameStartr.IGameStartr;

        constructor(UserWrapper: UserWrappr) {
            this.UserWrapper = UserWrapper;
            this.GameStarter = this.UserWrapper.getGameStarter();
        }
    }

    /**
     * 
     */
    class OptionsButtonsGenerator extends AbstractOptionsGenerator implements IOptionsGenerator {
        generate(schema) {
            var output = document.createElement("div"),
                options = schema.options instanceof Function
                    ? schema.options.call(self, this.GameStarter)
                    : schema.options,
                optionKeys = Object.keys(options),
                keyActive = schema.keyActive || "active",
                classNameStart = "select-option options-button-option",
                scope = this,
                option, element, i;

            output.className = "select-options select-options-buttons";

            for (i = 0; i < optionKeys.length; i += 1) {
                option = options[optionKeys[i]];

                element = document.createElement("div");
                element.className = classNameStart;
                element.textContent = optionKeys[i];

                element.onclick = function (schema, element) {
                    if (scope.UserWrapper.getParentControlDiv(element).getAttribute("active") !== "on") {
                        return;
                    }
                    schema.callback.call(scope, scope.GameStarter, schema, element);

                    if (element.getAttribute("option-enabled") == "true") {
                        element.setAttribute("option-enabled", false);
                        element.className = classNameStart + " option-disabled";
                    } else {
                        element.setAttribute("option-enabled", true);
                        element.className = classNameStart + " option-enabled";
                    }
                }.bind(undefined, schema, element);

                if (option[keyActive]) {
                    element.className += " option-enabled";
                    element.setAttribute("option-enabled", true);
                } else if (schema.assumeInactive) {
                    element.className += " option-disabled";
                    element.setAttribute("option-enabled", false);
                } else {
                    element.setAttribute("option-enabled", true);
                }

                output.appendChild(element);
            }

            return output;
        }
    }

    /**
     * 
     */
    class OptionsTableGenerator extends AbstractOptionsGenerator implements IOptionsGenerator {
        protected optionTypes = {
            "Boolean": this.setBooleanInput,
            "Keys": this.setKeyInput,
            "Number": this.setNumberInput,
            "Select": this.setSelectInput,
            "ScreenSize": this.setScreenSizeInput
        };

        generate(schema) {
            var output = document.createElement("div"),
                table = document.createElement("table"),
                details, row, label, input, child,
                i;

            output.className = "select-options select-options-table";

            if (schema.options) {
                for (i = 0; i < schema.options.length; i += 1) {
                    row = document.createElement("tr");
                    label = document.createElement("td");
                    input = document.createElement("td");

                    details = schema.options[i],

                    label.className = "options-label-" + details.type;
                    label.textContent = details.title;

                    input.className = "options-cell-" + details.type;

                    row.appendChild(label);
                    row.appendChild(input);

                    child = this.optionTypes[schema.options[i].type](input, details, schema);
                    if (details.storeLocally) {
                        this.UserWrapper.ensureLocalStorageValue(child, details, schema);
                    }

                    table.appendChild(row);
                }
            }

            output.appendChild(table);

            if (schema.actions) {
                for (i = 0; i < schema.actions.length; i += 1) {
                    row = document.createElement("div");

                    details = schema.actions[i];

                    row.className = "select-option options-button-option";
                    row.textContent = details.title;
                    row.onclick = details.action.bind(this, this.GameStarter);

                    output.appendChild(row);
                }
            }

            return output;
        }

        protected setBooleanInput(input, details, schema) {
            var status = details.source.call(this, this.GameStarter) ? "on" : "off",
                statusString = status === "on" ? "enabled" : "disabled",
                scope = this;

            input.className = "select-option options-button-option option-" + statusString;
            input.textContent = status;

            input.onclick = function () {
                input.setValue(input.textContent === "off");
            };

            input.setValue = function (newStatus) {
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
                    scope.UserWrapper.storeLocalStorageValue(input, newStatus.toString());
                }
            };

            return input;
        }

        protected setKeyInput(input, details, schema) {
            var values = details.source.call(this, this.GameStarter),
                children = [],
                child, i, j;

            for (i = 0; i < values.length; i += 1) {
                child = document.createElement("select");
                child.className = "options-key-option";

                for (j = 0; j < this.UserWrapper.getAllPossibleKeys().length; j += 1) {
                    child.appendChild(new Option(this.UserWrapper.getAllPossibleKeys()[j]));
                }
                child.value = child.valueOld = values[i].toLowerCase();

                child.onchange = (function (child) {
                    details.callback.call(this, this.GameStarter, child.valueOld, child.value);
                    if (details.storeLocally) {
                        this.storeLocalStorageValue(child, child.value);
                    }
                }).bind(undefined, child);

                children.push(child);
                input.appendChild(child);
            }

            return children;
        }

        protected setNumberInput(input, details, schema) {
            var child = document.createElement("input");

            child.type = "number";
            child.value = Number(details.source.call(this, this.GameStarter)).toString();
            child.min = details.minimum || 0;
            child.max = details.maximum || Math.max(details.minimum + 10, 10);

            child.onchange = child.oninput = function () {
                if (child.checkValidity()) {
                    details.update.call(this, this.GameStarter, child.value);
                }
                if (details.storeLocally) {
                    this.GameStarter.storeLocalStorageValue(child, child.value);
                }
            };

            input.appendChild(child);

            return child;
        }

        protected setSelectInput(input, details, schema) {
            var child = document.createElement("select"),
                options = details.options(),
                i;

            for (i = 0; i < options.length; i += 1) {
                child.appendChild(new Option(options[i]));
            }

            child.value = details.source.call(this, this.GameStarter);

            child.onchange = function () {
                details.update.call(this, this.GameStarter, child.value);
                child.blur();

                if (details.storeLocally) {
                    this.UserWrapper.storeLocalStorageValue(child, child.value);
                }
            };

            input.appendChild(child);

            return child;
        }

        protected setScreenSizeInput(input, details, schema) {
            var scope = this,
                child;

            details.options = function () {
                return Object.keys(this.UserWrapper.sizes);
            };

            details.source = function () {
                return scope.UserWrapper.getCurrentSize();
            };

            details.update = function (GameStarter, value) {
                if (value === scope.UserWrapper.getCurrentSize()) {
                    return;
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
    class LevelEditorGenerator extends AbstractOptionsGenerator implements IOptionsGenerator {
        generate(schema) {
            var output = document.createElement("div"),
                title = document.createElement("div"),
                button = document.createElement("div"),
                between = document.createElement("div"),
                uploader = this.createUploaderDiv(),
                scope = this;

            output.className = "select-options select-options-level-editor";

            title.className = "select-option-title";
            title.textContent = "Create your own custom levels:";

            button.className = "select-option select-option-large options-button-option";
            button.innerHTML = "Start the <br /> Level Editor!";
            button.onclick = function () {
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

        protected createUploaderDiv() {
            var uploader = document.createElement("div"),
                input = document.createElement("input");

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

        protected handleFileDragEnter(uploader, event) {
            if (event.dataTransfer) {
                event.dataTransfer.dropEFfect = "copy";
            }
            uploader.className += " hovering";
        }

        protected handleFileDragOver(uploader, event) {
            event.preventDefault();
            return false;
        }

        protected handleFileDragLeave(uploader, event) {
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = "none"
            }
            uploader.className = uploader.className.replace(" hovering", "");
        }

        protected handleFileDrop(input, uploader, event) {
            var files = input.files || event.dataTransfer.files,
                file = files[0],
                reader = new FileReader();

            this.handleFileDragLeave(input, event);
            event.preventDefault();
            event.stopPropagation();

            reader.onprogress = this.handleFileUploadProgress.bind(this, file, uploader);
            reader.onloadend = this.handleFileUploadCompletion.bind(this, file, uploader);

            reader.readAsText(file);
        }

        protected handleFileUploadProgress(file, uploader, event) {
            var percent;

            if (!event.lengthComputable) {
                return;
            }

            percent = Math.round((event.loaded / event.total) * 100);

            if (percent > 100) {
                percent = 100;
            }

            uploader.innerText = "Uploading '" + file.name + "' (" + percent + "%)...";
        }

        protected handleFileUploadCompletion(file, uploader, event) {
            this.GameStarter.LevelEditor.handleUploadCompletion(event);
            uploader.innerText = uploader.getAttribute("textOld");
        }
    }

    /**
     * 
     */
    class MapsGridGenerator extends AbstractOptionsGenerator implements IOptionsGenerator {
        generateRangedTable(schema): HTMLTableElement {
            var scope = this,
                table = document.createElement("table"),
                rangeX = schema.rangeX,
                rangeY = schema.rangeY,
                row,
                element,
                i: number,
                j: number;

            for (i = rangeY[0]; i <= rangeY[1]; i += 1) {
                row = document.createElement("tr");
                row.className = "maps-grid-row";

                for (j = rangeX[0]; j <= rangeX[1]; j += 1) {
                    element = document.createElement("td");
                    element.className = "select-option maps-grid-option maps-grid-option-range";
                    element.textContent = i + "-" + j;
                    element.onclick = (function (callback) {
                        if (scope.UserWrapper.getParentControlDiv(element).getAttribute("active") === "on") {
                            callback();
                        }
                    }).bind(scope, schema.callback.bind(scope, scope.GameStarter, schema, element));
                    row.appendChild(element);
                }

                table.appendChild(row);
            }

            return table;
        }

        appendExtras(output, schema): void {
            var element,
                extra,
                i, j;

            for (i in schema.extras) {
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

        generate(schema) {
            var output = document.createElement("div");

            output.className = "select-options select-options-maps-grid";

            if (schema.rangeX && schema.rangeY) {
                output.appendChild(this.generateRangedTable(schema));
            }

            if (schema.extras) {
                this.appendExtras(output, schema);
            }

            return output;
        }
    }
}
