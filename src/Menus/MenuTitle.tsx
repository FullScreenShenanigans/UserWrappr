import { observer } from "mobx-react";
import * as React from "react";

import { MenuTitleStore } from "./MenuTitleStore";

export const MenuTitle = observer(({ store }: { store: MenuTitleStore }) => (
    <h4
        className={store.classNames.menuTitle}
        onClick={store.onClick}
        style={store.styles.menuTitle as React.CSSProperties}
    >
        {store.title}
    </h4>
));
