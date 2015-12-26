module UserWrappr.UISchemas {
    "use strict";

    /**
     * Base class for options generators. These all store a UserWrapper and
     * its GameStartr, along with a generate Function 
     */
    export abstract class OptionsGenerator implements IOptionsGenerator {
        /**
         * 
         */
        protected UserWrapper: UserWrappr.UserWrappr;

        /**
         * 
         */
        protected GameStarter: IGameStartr;

        /**
         * @param {UserWrappr} UserWrappr
         */
        constructor(UserWrapper: UserWrappr.UserWrappr) {
            this.UserWrapper = UserWrapper;
            this.GameStarter = this.UserWrapper.getGameStarter();
        }

        /**
         * Generates a control element based on the provided schema.
         */
        generate(schema: ISchema): HTMLDivElement {
            throw new Error("AbstractOptionsGenerator is abstract. Subclass it.");
        }

        /**
         * Recursively searches for an element with the "control" class
         * that's a parent of the given element.
         * 
         * @param {HTMLElement} element
         * @return {HTMLElement}
         */
        protected getParentControlDiv(element: HTMLElement): HTMLElement {
            if (element.className === "control") {
                return element;
            } else if (!element.parentNode) {
                return element;
            }

            return this.getParentControlDiv(element.parentElement);
        }

        /**
         *
         */
        protected ensureLocalStorageButtonValue(
            child: HTMLDivElement,
            details: IOptionsButtonSchema,
            schema: IOptionsButtonsSchema): void {
            var key: string = schema.title + "::" + details.title,
                valueDefault: string = details.source.call(this, this.GameStarter).toString(),
                value: string;

            child.setAttribute("localStorageKey", key);
            this.GameStarter.ItemsHolder.addItem(key, {
                "storeLocally": true,
                "valueDefault": valueDefault
            });

            value = this.GameStarter.ItemsHolder.getItem(key);
            if (value.toString().toLowerCase() === "true") {
                details[schema.keyActive || "active"] = true;
                schema.callback.call(this, this.GameStarter, schema, child);
            }
        }

        /**
         * Ensures an input's required local storage value is being stored,
         * and adds it to the internal GameStarter.ItemsHolder if not. If it
         * is, and the child's value isn't equal to it, the value is set.
         * 
         * @param {Mixed} childRaw   An input or select element, or an Array
         *                           thereof. 
         * @param {Object} details   Details containing the title of the item 
         *                           and the source Function to get its value.
         * @param {Object} schema   The container schema this child is within.
         */
        protected ensureLocalStorageInputValue(childRaw: IChoiceElement | IChoiceElement[], details: IOption, schema: ISchema): void {
            if (childRaw.constructor === Array) {
                this.ensureLocalStorageValues(<IInputElement[]>childRaw, details, schema);
                return;
            }

            var child: IInputElement | ISelectElement = <IInputElement | ISelectElement>childRaw,
                key: string = schema.title + "::" + details.title,
                valueDefault: string = details.source.call(this, this.GameStarter).toString(),
                value: string;

            child.setAttribute("localStorageKey", key);
            this.GameStarter.ItemsHolder.addItem(key, {
                "storeLocally": true,
                "valueDefault": valueDefault
            });

            value = this.GameStarter.ItemsHolder.getItem(key);
            if (value !== "" && value !== child.value) {
                child.value = value;

                if (child.setValue) {
                    child.setValue(value);
                } else if (child.onchange) {
                    child.onchange(undefined);
                } else if (child.onclick) {
                    child.onclick(undefined);
                }
            }
        }

        /**
         * The equivalent of ensureLocalStorageValue for an entire set of 
         * elements, running the equivalent logic on all of them.
         * 
         * @param {Mixed} childRaw   An Array of input or select elements.
         * @param {Object} details   Details containing the title of the item 
         *                           and the source Function to get its value.
         * @param {Object} schema   The container schema this child is within.
         */
        protected ensureLocalStorageValues(children: (IInputElement | ISelectElement)[], details: IOption, schema: ISchema): void {
            var keyGeneral: string = schema.title + "::" + details.title,
                values: any[] = details.source.call(this, this.GameStarter),
                key: string,
                value: any,
                child: IInputElement | ISelectElement,
                i: number;

            for (i = 0; i < children.length; i += 1) {
                key = keyGeneral + "::" + i;
                child = children[i];
                child.setAttribute("localStorageKey", key);

                this.GameStarter.ItemsHolder.addItem(key, {
                    "storeLocally": true,
                    "valueDefault": values[i]
                });

                value = this.GameStarter.ItemsHolder.getItem(key);
                if (value !== "" && value !== child.value) {
                    child.value = value;

                    if (child.onchange) {
                        child.onchange(undefined);
                    } else if (child.onclick) {
                        child.onclick(undefined);
                    }
                }
            }
        }

        /**
         * Stores an element's value in the internal GameStarter.ItemsHolder,
         * if it has the "localStorageKey" attribute.
         * 
         * @param {HTMLElement} child   An element with a value to store.
         * @param {Mixed} value   What value is to be stored under the key.
         */
        protected storeLocalStorageValue(child: IInputElement | ISelectElement, value: any): void {
            var key: string = child.getAttribute("localStorageKey");

            if (key) {
                this.GameStarter.ItemsHolder.setItem(key, value);
                this.GameStarter.ItemsHolder.saveItem(key);
            }
        }
    }
}
