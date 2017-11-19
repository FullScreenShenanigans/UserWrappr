import { Display } from "./Display";
import { IUserWrapprSettings } from "./IUserWrappr";
import { IInitializeMenusView, IInitializeMenusViewWrapper } from "./Menus/InitializeMenus";
import { IRelativeSizeSchema } from "./Sizing";

/**
 * View libraries required to initialize a wrapping display.
 */
const externalViewLibraries: string[] = [
    "react", "react-dom", "mobx", "mobx-react"
];

/**
 * Creates configurable HTML displays over fixed size contents.
 */
export class UserWrappr {
    /**
     * Settings for the UserWrappr.
     */
    private readonly settings: IUserWrapprSettings;

    /**
     * Initializes a new instance of the UserWrappr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IUserWrapprSettings) {
        this.settings = settings;
    }

    /**
     * Initializes a new display and contents.
     *
     * @returns A Promise for a Display wrapper around contents and their view.
     */
    public async createDisplay(): Promise<Display> {
        const viewLibrariesLoad: Promise<IInitializeMenusView> = this.loadViewLibraries();

        const display: Display = new Display(this.settings);
        await display.resetContents(this.settings.defaultSize);

        const initializeMenusView: IInitializeMenusView = await viewLibrariesLoad;

        await initializeMenusView({
            classNames: this.settings.classNames,
            container: this.settings.container,
            menus: this.settings.menus,
            setSize: async (size: IRelativeSizeSchema): Promise<void> => {
                throw new Error(`Not implemented yet! (should take in size ${JSON.stringify(size)}.`);
            },
            setTimeout: this.settings.setTimeout,
            transitionTime: this.settings.transitionTime
        });

        return display;
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
