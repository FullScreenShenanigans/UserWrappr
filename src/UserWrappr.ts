import { defaultClassNames } from "./Bootstrapping/ClassNames";
import { createElement } from "./Bootstrapping/CreateElement";
import { getAvailableContainerSize } from "./Bootstrapping/GetAvailableContainerSize";
import { defaultStyles } from "./Bootstrapping/Styles";
import { Display } from "./Display";
import { ICompleteUserWrapprSettings, IOptionalUserWrapprSettings, IUserWrappr, IUserWrapprSettings } from "./IUserWrappr";
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
 *
 * @remarks This allows scripts to not attempt to access overriden globals like requirejs.
 */
const defaultSettings: IOptionalUserWrapprSettingsDefaults = {
    classNames: () => defaultClassNames,
    createElement: () => createElement,
    defaultSize: () => ({
        height: "100%",
        width: "100%"
    }),
    getAvailableContainerSize: () => getAvailableContainerSize,
    menuInitializer: () => "UserWrappr-Delayed",
    menus: () => [],
    setTimeout: () => setTimeout.bind(window),
    styles: () => defaultStyles,
    transitionTime: () => 0,
    requirejs: () => requirejs
};

/**
 * Backs up an optional provided setting with its default.
 *
 * @param value   Provided partial setting, if it exists.
 * @param getDefault   Gets the default setting value.
 * @returns Complete filled-out setting value.
 */
const ensureOptionalSetting = <TSetting>(value: TSetting | undefined, getDefault: () => TSetting): TSetting =>
    value === undefined
        ? getDefault()
        : value;

/**
 * Overrides a default setting with a provided partial setting.
 *
 * @param value   Provided partial setting, if it exists.
 * @param getDefault   Gets the default setting value.
 * @returns Complete filled-out setting value.
 */
const overrideDefaultSetting = <TSetting extends object>(value: Partial<TSetting> | undefined, backup: () => TSetting): TSetting => {
    if (value === undefined) {
        return backup();
    }

    const output: Partial<TSetting> = backup();

    for (const key in value) {
        output[key] = {
            ...(output[key] as object),
            ...(value[key] as object)
        };
    }

    return output as TSetting;
};

/**
 * Creates configurable HTML displays over fixed size contents.
 */
export class UserWrappr implements IUserWrappr {
    /**
     * Settings for the UserWrappr.
     */
    private readonly settings: ICompleteUserWrapprSettings;

    /**
     * Contains generated contents and menus, once instantiated.
     */
    private display: Display;

    /**
     * Initializes a new instance of the UserWrappr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IUserWrapprSettings) {
        this.settings = {
            classNames: overrideDefaultSetting(settings.classNames, defaultSettings.classNames),
            createContents: settings.createContents,
            createElement: ensureOptionalSetting(settings.createElement, defaultSettings.createElement),
            defaultSize: ensureOptionalSetting(settings.defaultSize, defaultSettings.defaultSize),
            getAvailableContainerSize: ensureOptionalSetting(settings.getAvailableContainerSize, defaultSettings.getAvailableContainerSize),
            menuInitializer: ensureOptionalSetting(settings.menuInitializer, defaultSettings.menuInitializer),
            menus: ensureOptionalSetting(settings.menus, defaultSettings.menus),
            setTimeout: ensureOptionalSetting(settings.setTimeout, defaultSettings.setTimeout),
            styles: overrideDefaultSetting(settings.styles, defaultSettings.styles),
            transitionTime: ensureOptionalSetting(settings.transitionTime, defaultSettings.transitionTime),
            requirejs: ensureOptionalSetting(settings.requirejs, defaultSettings.requirejs),
        };
    }

    /**
     * Initializes a new display and contents.
     *
     * @param container   Element to instantiate contents within.
     * @returns A Promise for having created contents and menus.
     */
    public async createDisplay(container: HTMLElement): Promise<void> {
        if (this.display !== undefined) {
            throw new Error("Cannot create multiple displays from a UserWrappr.");
        }

        const viewLibrariesLoad: Promise<IInitializeMenusView> = this.loadViewLibraries();

        const display: Display = new Display({
            classNames: this.settings.classNames,
            container,
            createElement: this.settings.createElement,
            createContents: this.settings.createContents,
            getAvailableContainerSize: this.settings.getAvailableContainerSize,
            menus: this.settings.menus,
            styles: this.settings.styles
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
            styles: this.settings.styles,
            transitionTime: this.settings.transitionTime
        });

        this.display = display;
    }

    public resetControls(): void {
        console.log("I suppose this is supposed to do something...");
    }

    /**
     * Resets the internal contents to a new size, if created yet.
     *
     * @param size   New size of the contents.
     * @returns Whether the display was available to reset size.
     */
    public resetSize(size: IRelativeSizeSchema): boolean {
        if (this.display === undefined) {
            return false;
        }

        this.display.resetContents(size);
        return true;
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
