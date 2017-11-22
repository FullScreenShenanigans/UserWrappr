import { Display } from "./Display";
import { createElement } from "./Elements/createElement";
import { getAvailableContainerSize } from "./Elements/getAvailableContainerSize";
import { ICompleteUserWrapprSettings, IOptionalUserWrapprSettings, IUserWrapprSettings } from "./IUserWrappr";
import { IInitializeMenusView, IInitializeMenusViewWrapper } from "./Menus/InitializeMenus";
import { IRelativeSizeSchema } from "./Sizing";

/**
 * View libraries required to initialize a wrapping display.
 */
const externalViewLibraries: string[] = [
    "react", "react-dom", "mobx", "mobx-react"
];

/**
 * Getters for the defaults of each optional UserWrappr setting.
 */
type IOptionalUserWrapprSettingsDefaults = {
    [P in keyof IOptionalUserWrapprSettings]: () => IOptionalUserWrapprSettings[P];
};

/**
 * Getters for the defaults of each optional UserWrappr setting.
 */
const defaultSettings: IOptionalUserWrapprSettingsDefaults = {
    classNames: () => ({
        innerArea: "inner-area",
        options: "options",
        outerArea: "outer-area",
        menu: "menu",
        menuTitle: "menu-title"
    }),
    createElement: () => createElement,
    defaultSize: () => ({
        height: "100%",
        width: "100%"
    }),
    getAvailableContainerSize: () => getAvailableContainerSize,
    menuInitializer: () => "UserWrappr-Delayed",
    menus: () => [],
    setTimeout: () => setTimeout,
    transitionTime: () => 0,
    requirejs: () => requirejs
};

/**
 * @remarks This allows scripts to not attempt to access overriden globals like requirejs.
 */
const getDefaultSetting = <TSetting>(value: TSetting | undefined, backup: () => TSetting): TSetting =>
    value === undefined
        ? backup()
        : value;

/**
 * Creates configurable HTML displays over fixed size contents.
 */
export class UserWrappr {
    /**
     * Settings for the UserWrappr.
     */
    private readonly settings: ICompleteUserWrapprSettings;

    /**
     * Initializes a new instance of the UserWrappr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IUserWrapprSettings) {
        this.settings = {
            classNames: getDefaultSetting(settings.classNames, defaultSettings.classNames),
            createContents: settings.createContents,
            createElement: getDefaultSetting(settings.createElement, defaultSettings.createElement),
            defaultSize: getDefaultSetting(settings.defaultSize, defaultSettings.defaultSize),
            getAvailableContainerSize: getDefaultSetting(settings.getAvailableContainerSize, defaultSettings.getAvailableContainerSize),
            menuInitializer: getDefaultSetting(settings.menuInitializer, defaultSettings.menuInitializer),
            menus: getDefaultSetting(settings.menus, defaultSettings.menus),
            setTimeout: getDefaultSetting(settings.setTimeout, defaultSettings.setTimeout),
            transitionTime: getDefaultSetting(settings.transitionTime, defaultSettings.transitionTime),
            requirejs: getDefaultSetting(settings.requirejs, defaultSettings.requirejs),
        };
    }

    /**
     * Initializes a new display and contents.
     *
     * @param container   Element to instantiate contents within.
     * @returns A Promise for a Display wrapper around contents and their view.
     */
    public async createDisplay(container: HTMLElement): Promise<Display> {
        const viewLibrariesLoad: Promise<IInitializeMenusView> = this.loadViewLibraries();

        const display: Display = new Display({
            classNames: this.settings.classNames,
            container,
            createElement: this.settings.createElement,
            createContents: this.settings.createContents,
            getAvailableContainerSize: this.settings.getAvailableContainerSize,
            menus: this.settings.menus,
        });

        await display.resetContents(this.settings.defaultSize);

        const initializeMenusView: IInitializeMenusView = await viewLibrariesLoad;

        await initializeMenusView({
            classNames: this.settings.classNames,
            container,
            menus: this.settings.menus,
            setSize: async (size: IRelativeSizeSchema): Promise<void> => {
                throw new Error(`Not implemented yet! (should take in size ${JSON.stringify(size)}.`);
            },
            setTimeout: this.settings.setTimeout,
            transitionTime: this.settings.transitionTime
        });

        return display;
    }

    public resetControls(): void {
        console.log("I suppose this is supposed to do something...");
    }

    /**
     * Loads external view logic.
     *
     * @returns A Promise for a method to create a wrapping game view in a container.
     */
    private async loadViewLibraries(): Promise<IInitializeMenusView> {
        await this.require(externalViewLibraries);

        const wrapperModule: IInitializeMenusViewWrapper = await this.require<IInitializeMenusViewWrapper>([
            this.settings.menuInitializer
        ]);

        return wrapperModule.initializeMenus;
    }

    /**
     * Loads external scripts.
     *
     * @param modules   Module identifiers of the scripts.
     * @returns Required contents of the scripts.
     */
    private async require<TResults>(modules: string[]): Promise<TResults> {
        return new Promise<TResults>((resolve, reject) => {
            requirejs(modules, resolve, reject);
        });
    }
}
