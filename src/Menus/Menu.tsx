import { observer } from "mobx-react";
import * as React from "react";

import { menuStyle, menuTitleStyle } from "../Bootstrapping/MenuStyles";
import { MenuStore, VisualState } from "./MenuStore";

export const Menu = observer(({ children, store }: { children?: React.ReactNode; store: MenuStore }) => (
    <div
        className={`${store.classNames.menu} ${store.classNames.menu}-${VisualState[store.visualState]}`}
        style={menuStyle as React.CSSProperties}
    >
        {children}
        <h4
            className={store.classNames.menuTitle}
            style={menuTitleStyle as React.CSSProperties}
        >
            {store.title}
        </h4>
    </div>
));
