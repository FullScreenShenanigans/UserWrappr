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
    export interface IGameStartrConstructor {
        new (GameStartrSettings?): GameStartr.IGameStartr;
    }

    export interface IGameStartrUISettings extends GameStartr.IGameStartrCustomsObject {
        helpSettings: IGameStartrUIHelpSettings;
        schemas: UISchemas.ISchema[];
        sizes: {
            [i: string]: IUserWrapprSizeSummary;
        };
        styleSheet?: StyleSheet;
        globalName?: string;
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
        usage: string;
        examples: IGameStartrUIHelpExample[];
    }

    export interface IGameStartrUIHelpExample {
        code: string;
        comment: string;
    }

    export module UISchemas {
        export interface ISchema {
            generator: string;
            title: string;
        }

        export interface IOptionsButtonsSchema extends ISchema {
            options: IOptionsButtonSchema[];
        }

        export interface IOptionsButtonSchema {
            callback: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => void;
            source: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => void;
            storeLocally?: boolean;
            title: string;
            type: string;
        }

        export interface IOptionsTableSchema extends ISchema {
            actions?: IOptionsTableAction[];
            options: any[];
        }

        export interface IOptionsTableAction {
            title: string;
            action: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => void;
        }

        export interface IOptionsTableOption {
            title: string;
            type: string;
            source: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => any;
            storeLocally?: boolean;
        }

        export interface IOptionsTableBooleanOption extends IOptionsTableOption {
            disable: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => void;
            enable: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => void;
            options?: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => any[];
            keyActive?: string;
            assumeInactive?: boolean;
        }

        export interface IOptionsTableKeysOption extends IOptionsTableOption {
            callback: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => void;
            source: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => any;
        }

        export interface IOptionsTableNumberOption extends IOptionsTableOption {
            minimum: number;
            maximum: number;
            update: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => void;
        }

        export interface IOptionsTableSelectOption extends IOptionsTableOption {
            options: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => void;
            source: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => void;
            update: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => void;
        }

        export interface IOptionsTableScreenSizeOption extends IOptionsTableOption { }

        export interface IOptionsMapGridSchema extends ISchema {
            rangeX: number[];
            rangeY: number[];
            callback: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => void;
            extras?: {
                [i: string]: IOptionsMapGridExtra;
            };
        }

        export interface IOptionsMapGridExtra {
            callback: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => void;
            extraElements: IOptionsMapGridExtraElement[];
        }

        export interface IOptionsMapGridExtraElement {
            tag: string;
            options: any;
        }
    }

    export interface IOptionsGenerator {
        generate: (schema: UISchemas.ISchema) => HTMLDivElement;
    }

    export interface IUserWrapprSizeSummary {
        full?: boolean;
        width: number;
        height: number;
    }

    export interface IUserWrapprSettings {
        GameStartrConstructor: IGameStartrConstructor;
        helpSettings: IGameStartrUIHelpSettings;
        globalName: string;
        sizes: {
            [i: string]: IUserWrapprSizeSummary;
        };
        sizeDefault: string;
        allPossibleKeys?: string[];
        log?: (...args: any[]) => void;
        customs?: GameStartr.IGameStartrCustoms;
    }

    export interface IUserWrappr {

    }
}
