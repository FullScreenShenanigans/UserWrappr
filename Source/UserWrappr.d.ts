/* tslint:disable:interface-name */

interface HTMLElement {
    requestFullScreen: () => void;
    webkitRequestFullScreen: () => void;
    mozRequestFullScreen: () => void;
    webkitFullscreenElement: () => void;
    cancelFullScreen: () => void;
    webkitCancelFullScreen: () => void;
    mozCancelFullScreen: () => void;
    msCancelFullScreen: () => void;
}

declare module UserWrappr {
    export interface IGameStartr {
        DeviceLayer: DeviceLayr.IDeviceLayr;
        GamesRunner: GamesRunnr.IGamesRunnr;
        ItemsHolder: ItemsHoldr.IItemsHoldr;
        InputWriter: InputWritr.IInputWritr;
        LevelEditor: LevelEditr.ILevelEditr;
        UserWrapper: IUserWrappr;
        container: HTMLElement;
        addPageStyles(styles: StyleSheet): void;
        gameStart(): void;
        createElement(tag: string, ...args: any[]): HTMLElement;
        proliferate(recipient: any, donor: any, noOverride?: boolean): any;
    }

    type IGameStartrCustoms = any;

    export interface IGameStartrConstructor {
        new (...args: any[]): IGameStartr;
    }

    export interface IGameStartrUIHelpSettings {
        globalNameAlias: string;
        openings: string[];
        options: {
            [i: string]: IGameStartrUIHelpOption[]
        };
    }

    export interface IGameStartrUIHelpOption {
        title: string;
        description: string;
        usage?: string;
        examples?: IGameStartrUIHelpExample[];
    }

    export interface IGameStartrUIHelpExample {
        code: string;
        comment: string;
    }

    export interface IOptionsGenerator {
        generate: (schema: UISchemas.ISchema) => HTMLDivElement;
    }

    export interface IUserWrapprSizeSummary {
        width: number;
        height: number;
        name?: string;
        full?: boolean;
    }

    export interface IUISettings {
        helpSettings: IGameStartrUIHelpSettings;
        globalName: string;
        sizes: {
            [i: string]: IUserWrapprSizeSummary;
        };
        sizeDefault: string;
        schemas: UISchemas.ISchema[];
        allPossibleKeys?: string[];
        gameElementSelector?: string;
        gameControlsSelector?: string;
        log?: (...args: any[]) => void;
        customs?: IGameStartrCustoms;
        styleSheet?: StyleSheet;
    }

    export interface IUserWrapprSettings extends IUISettings {
        GameStartrConstructor: IGameStartrConstructor;
    }

    export interface IUserWrappr {
        resetGameStarter(settings: IUserWrapprSettings, customs?: IGameStartrCustoms): void;
        getGameStartrConstructor(): IGameStartrConstructor;
        getGameStarter(): IGameStartr;
        getItemsHolder(): ItemsHoldr.ItemsHoldr;
        getSettings(): IUserWrapprSettings;
        getCustoms(): IGameStartrCustoms;
        getHelpSettings(): IGameStartrUIHelpSettings;
        getGlobalName(): string;
        getGameNameAlias(): string;
        getAllPossibleKeys(): string[];
        getSizes(): { [i: string]: IUserWrapprSizeSummary };
        getCurrentSize(): IUserWrapprSizeSummary;
        getIsFullScreen(): boolean;
        getIsPageHidden(): boolean;
        getLogger(): (...args: any[]) => string;
        getGenerators(): { [i: string]: IOptionsGenerator };
        getDocumentElement(): HTMLHtmlElement;
        getRequestFullScreen(): () => void;
        getCancelFullScreen(): () => void;
        setCurrentSize(size: string | IUserWrapprSizeSummary): void;
        displayHelpMenu(): void;
        displayHelpOptions(): void;
        displayHelpGroupSummary(optionName: string): void;
        displayHelpOption(optionName: string): void;
        logHelpText(text: string): void;
        filterHelpText(text: string): string;
        padTextRight(text: string, length: number): string;
    }

    /**
     * Generators and descriptors for controls generated by an IUserWrappr.
     */
    export module UISchemas {
        /**
         * A general descripton of a user control containing some number of options.
         */
        export interface ISchema {
            /**
             * The name of the generator that should create this control.
             */
            generator: string;

            /**
             * The label for the control that users will see.
             */
            title: string;
        }

        /**
         * A general description of a single option within a user control.
         */
        export interface IOption {
            /**
             * The label for the option that users will see.
             */
            title: string;

            /**
             * A source Function for the option's initial value.
             */
            source: IOptionSource;
        }

        /**
         * A source Function for an option's individual value.
         * 
         * @param GameStarter   The GameStarter instance this control is for.
         * @returns An initial value for an option control.
         */
        export interface IOptionSource {
            (GameStarter: IGameStartr, ...args: any[]): any;
        }

        /**
         * An HTMLElement that has been given a utility setValue Function.
         */
        export interface IChoiceElement extends HTMLElement {
            /**
             * A utility Function to set this HTMLElement's value.
             * 
             * @param value   A new value for this element.
             */
            setValue(value: any): void;
        }

        /**
         * An HTMLInputElement that has been given a utility setValue Function.
         */
        export interface IInputElement extends HTMLInputElement, IChoiceElement { }

        /**
         * An HTMLSelectElement that has been given a utility setValue Function, as
         * well as a variable to hold a previous value.
         */
        export interface ISelectElement extends HTMLSelectElement {
            /**
             * A previous value for this element.
             */
            valueOld?: string;

            /**
             * A utility Function to set this HTMLElement's value.
             * 
             * @param value   A new value for this element.
             */
            setValue(value: any): void;
        }
    }
}
