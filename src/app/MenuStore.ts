import { observable } from "mobx";

export enum VisualState {
    /**
     * The menu isn't opened yet.
     */
    Closed,

    /**
     * The menu is opening.
     */
    Opened,

    /**
     * The menu is fully open.
     */
    Opening
}

export class MenuStore {
    @observable
    private visualState: VisualState;
}
