import { Display, ICreateWrappingView } from "./Display";
import { IUserWrapprSettings } from "./IUserWrappr";

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
        const viewLibrariesLoad = this.loadViewLibraries();
        const display = new Display({
            container: this.settings.container,
            getWindowSize: this.settings.getWindowSize,
            createContents: this.settings.createContents,
            menus: this.settings.menus
        });

        await display.resetContents(this.settings.defaultSize);

        const createWrappingView = await viewLibrariesLoad;
        await display.resetWrappingView(createWrappingView);

        return display;
    }

    /**
     * Loads external view logic.
     *
     * @returns A Promise for a method to create a wrapping game view in a container.
     */
    private async loadViewLibraries(): Promise<ICreateWrappingView> {
        await this.require(externalViewLibraries);

        const [viewLogic] = await this.require<[ICreateWrappingView]>([
            this.settings.delayedScripts
        ]);

        return viewLogic;
    }

    /**
     * Loads external scripts.
     *
     * @param modules   Module identifiers of the scripts.
     * @returns Required contents of the scripts.
     */
    private async require<TResults extends {}[]>(modules: string[]): Promise<TResults> {
        return new Promise<TResults>((resolve, reject) => {
            requirejs(modules, resolve, reject);
        });
    }
}
