import * as React from "react";

import { Menu } from "./Menu";
import { IMenuAndOptionsListStores, MenusStore } from "./MenusStore";
import { Options } from "./Options/Options";

const renderMenuAndOptionsList = (stores: IMenuAndOptionsListStores) => (
    <Menu store={stores.menu}>
        <Options key={stores.menu.titleStore.title} store={stores.options} />
    </Menu>
);

export const Menus = ({ store }: { store: MenusStore }) => (
    <div
        className={store.classNames.innerArea}
        style={store.styles.innerArea as React.CSSProperties}
    >
        {store.menuAndOptionListStores.map(renderMenuAndOptionsList)}
    </div>
);
