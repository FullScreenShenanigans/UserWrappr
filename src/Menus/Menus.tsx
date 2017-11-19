import * as React from "react";

import { IOptionSchema } from "../../src/Menus/Options/OptionSchemas";
import { Menu } from "./Menu";
import { IMenuAndOptionsListStores, MenusStore } from "./MenusStore";
import { Options } from "./Options/Options";

/**
 * Schema for a menu containing options.
 */
export interface IMenu {
    /**
     * Options within the menu.
     */
    options: IOptionSchema[];

    /**
     * Identifying menu title.
     */
    title: string;
}

export class Menus extends React.Component<{ store: MenusStore }> {
    public render() {
        return this.props.store.menuAndOptionListStores.map(this.renderMenuAndOptionsList);
    }

    private renderMenuAndOptionsList = (stores: IMenuAndOptionsListStores, key: number) => (
        <Menu store={stores.menu}>
            <Options key={key} store={stores.options} />
        </Menu>
    )
}
