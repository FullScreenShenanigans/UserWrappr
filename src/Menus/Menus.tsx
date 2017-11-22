import * as React from "react";

import { Menu } from "./Menu";
import { IMenuAndOptionsListStores, MenusStore } from "./MenusStore";
import { Options } from "./Options/Options";

const renderMenuAndOptionsList = (stores: IMenuAndOptionsListStores) => (
    <Menu store={stores.menu}>
        <Options key={stores.menu.title} store={stores.options} />
    </Menu>
);

export class Menus extends React.Component<{ store: MenusStore }> {
    public render() {
        return this.props.store.menuAndOptionListStores.map(renderMenuAndOptionsList);
    }
}
