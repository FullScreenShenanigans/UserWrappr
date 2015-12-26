module UserWrappr.UISchemas {
    "use strict";

    /**
     * An options generator for a table of options,.
     */
    export class TableGenerator extends OptionsGenerator implements IOptionsGenerator {
        protected optionTypes: IOptionsTableTypes = {
            "Boolean": this.setBooleanInput,
            "Keys": this.setKeyInput,
            "Number": this.setNumberInput,
            "Select": this.setSelectInput,
            "ScreenSize": this.setScreenSizeInput
        };

        generate(schema: IOptionsTableSchema): HTMLDivElement {
            var output: HTMLDivElement = document.createElement("div"),
                table: HTMLTableElement = document.createElement("table"),
                option: IOptionsTableOption,
                action: IOptionsTableAction,
                row: HTMLTableRowElement | HTMLDivElement,
                label: HTMLTableDataCellElement,
                input: HTMLTableDataCellElement,
                child: IInputElement | ISelectElement,
                i: number;

            output.className = "select-options select-options-table";

            if (schema.options) {
                for (i = 0; i < schema.options.length; i += 1) {
                    row = document.createElement("tr");
                    label = document.createElement("td");
                    input = document.createElement("td");

                    option = schema.options[i];

                    label.className = "options-label-" + option.type;
                    label.textContent = option.title;

                    input.className = "options-cell-" + option.type;

                    row.appendChild(label);
                    row.appendChild(input);

                    child = this.optionTypes[schema.options[i].type].call(this, input, option, schema);
                    if (option.storeLocally) {
                        this.ensureLocalStorageInputValue(child, option, schema);
                    }

                    table.appendChild(row);
                }
            }

            output.appendChild(table);

            if (schema.actions) {
                for (i = 0; i < schema.actions.length; i += 1) {
                    row = document.createElement("div");

                    action = schema.actions[i];

                    row.className = "select-option options-button-option";
                    row.textContent = action.title;
                    row.onclick = action.action.bind(this, this.GameStarter);

                    output.appendChild(row);
                }
            }

            return output;
        }

        protected setBooleanInput(input: IInputElement, details: IOptionsTableBooleanOption, schema: ISchema): IInputElement {
            var status: boolean = details.source.call(this, this.GameStarter),
                statusClass: string = status ? "enabled" : "disabled",
                scope: TableGenerator = this;

            input.className = "select-option options-button-option option-" + statusClass;
            input.textContent = status ? "on" : "off";

            input.onclick = function (): void {
                input.setValue(input.textContent === "off");
            };

            input.setValue = function (newStatus: string | boolean): void {
                if (newStatus.constructor === String) {
                    if (newStatus === "false" || newStatus === "off") {
                        newStatus = false;
                    } else if (newStatus === "true" || newStatus === "on") {
                        newStatus = true;
                    }
                }

                if (newStatus) {
                    details.enable.call(scope, scope.GameStarter);
                    input.textContent = "on";
                    input.className = input.className.replace("disabled", "enabled");
                } else {
                    details.disable.call(scope, scope.GameStarter);
                    input.textContent = "off";
                    input.className = input.className.replace("enabled", "disabled");
                }

                if (details.storeLocally) {
                    scope.storeLocalStorageValue(input, newStatus.toString());
                }
            };

            return input;
        }

        protected setKeyInput(input: IInputElement, details: IOptionsTableKeysOption, schema: ISchema): ISelectElement[] {
            var values: string = details.source.call(this, this.GameStarter),
                possibleKeys: string[] = this.UserWrapper.getAllPossibleKeys(),
                children: ISelectElement[] = [],
                child: ISelectElement,
                scope: TableGenerator = this,
                valueLower: string,
                i: number,
                j: number;

            for (i = 0; i < values.length; i += 1) {
                valueLower = values[i].toLowerCase();

                child = <ISelectElement>document.createElement("select");
                child.className = "options-key-option";
                child.value = child.valueOld = valueLower;

                for (j = 0; j < possibleKeys.length; j += 1) {
                    child.appendChild(new Option(possibleKeys[j]));

                    // Setting child.value won't work in IE or Edge...
                    if (possibleKeys[j] === valueLower) {
                        child.selectedIndex = j;
                    }
                }

                child.onchange = (function (child: ISelectElement): void {
                    details.callback.call(scope, scope.GameStarter, child.valueOld, child.value);
                    if (details.storeLocally) {
                        scope.storeLocalStorageValue(child, child.value);
                    }
                }).bind(undefined, child);

                children.push(child);
                input.appendChild(child);
            }

            return children;
        }

        protected setNumberInput(input: IInputElement, details: IOptionsTableNumberOption, schema: ISchema): IInputElement {
            var child: IInputElement = <UISchemas.IInputElement>document.createElement("input"),
                scope: TableGenerator = this;

            child.type = "number";
            child.value = Number(details.source.call(scope, scope.GameStarter)).toString();
            child.min = (details.minimum || 0).toString();
            child.max = (details.maximum || Math.max(details.minimum + 10, 10)).toString();

            child.onchange = child.oninput = function (): void {
                if (child.checkValidity()) {
                    details.update.call(scope, scope.GameStarter, child.value);
                }
                if (details.storeLocally) {
                    scope.storeLocalStorageValue(child, child.value);
                }
            };

            input.appendChild(child);

            return child;
        }

        protected setSelectInput(input: ISelectElement, details: IOptionsTableSelectOption, schema: ISchema): ISelectElement {
            var child: ISelectElement = <ISelectElement>document.createElement("select"),
                options: string[] = details.options(this.GameStarter),
                scope: TableGenerator = this,
                i: number;

            for (i = 0; i < options.length; i += 1) {
                child.appendChild(new Option(options[i]));
            }

            child.value = details.source.call(scope, scope.GameStarter);

            child.onchange = function (): void {
                details.update.call(scope, scope.GameStarter, child.value);
                child.blur();

                if (details.storeLocally) {
                    scope.storeLocalStorageValue(child, child.value);
                }
            };

            input.appendChild(child);

            return child;
        }

        protected setScreenSizeInput(input: ISelectElement, details: IOptionsTableScreenSizeOption, schema: ISchema): ISelectElement {
            var scope: TableGenerator = this,
                child: ISelectElement;

            details.options = function (): string[] {
                return Object.keys(scope.UserWrapper.getSizes());
            };

            details.source = function (): string {
                return scope.UserWrapper.getCurrentSize().name;
            };

            details.update = function (GameStarter: IGameStartr, value: IUserWrapprSizeSummary | string): ISelectElement {
                if (value === scope.UserWrapper.getCurrentSize()) {
                    return undefined;
                }

                scope.UserWrapper.setCurrentSize(value);
            };
            child = scope.setSelectInput(input, details, schema);

            return child;
        }
    }
}
