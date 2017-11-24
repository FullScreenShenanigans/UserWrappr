import { observer } from "mobx-react";
import * as React from "react";

import { Menu } from "./Menu";
import { IMenuAndOptionsListStores, MenusStore } from "./MenusStore";
import { Options } from "./Options/Options";

const renderMenuAndOptionsList = (stores: IMenuAndOptionsListStores) => (
    <Menu store={stores.menu}>
        <Options key={stores.menu.titleStore.title} store={stores.options} />
    </Menu>
);

export const Menus = observer(({ store }: { store: MenusStore }) => {
    const style = {
        ...store.styles.innerArea,
        width: `${store.containerSize.width}px`
    } as React.CSSProperties;

    return (
        <div
            className={store.classNames.innerArea}
            style={style}
        >
            {store.menuAndOptionListStores.map(renderMenuAndOptionsList)}
        </div>
    );
});
