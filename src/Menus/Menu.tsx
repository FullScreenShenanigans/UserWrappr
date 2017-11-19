import { observer } from "mobx-react";
import * as React from "react";

import { MenuStore, VisualState } from "./MenuStore";

// TODO: Instead of using class names, use inline styles and react-transition-group

export const Menu = observer(({ children, store }: { children?: React.ReactNode; store: MenuStore }) => (
    <div className={`${store.classNames.menu} ${store.classNames.menu}-${VisualState[store.visualState]}`}>
        {children}
        <div className={store.classNames.menuTitle}>
            {store.title}
        </div>
    </div>
));
