module UserWrappr.UISchemas {
    "use strict";

    /**
     * Options generator for a LevelEditr dialog.
     */
    export class LevelEditorGenerator extends OptionsGenerator implements IOptionsGenerator {
        generate(schema: IOptionsEditorSchema): HTMLDivElement {
            var output: HTMLDivElement = document.createElement("div"),
                starter: HTMLDivElement = document.createElement("div"),
                betweenOne: HTMLDivElement = document.createElement("div"),
                betweenTwo: HTMLDivElement = document.createElement("div"),
                uploader: HTMLDivElement = this.createUploaderDiv(),
                mapper: HTMLDivElement = this.createMapSelectorDiv(schema),
                scope: LevelEditorGenerator = this;

            output.className = "select-options select-options-level-editor";

            starter.className = "select-option select-option-large options-button-option";
            starter.innerHTML = "Start the <br /> Level Editor!";
            starter.onclick = function (): void {
                scope.GameStarter.LevelEditor.enable();
            };

            betweenOne.className = betweenTwo.className = "select-option-title";
            betweenOne.innerHTML = betweenTwo.innerHTML = "<em>- or -</em><br />";

            output.appendChild(starter);
            output.appendChild(betweenOne);
            output.appendChild(uploader);
            output.appendChild(betweenTwo);
            output.appendChild(mapper);

            return output;
        }

        protected createUploaderDiv(): HTMLDivElement {
            var uploader: HTMLDivElement = document.createElement("div"),
                input: HTMLInputElement = document.createElement("input");

            uploader.className = "select-option select-option-large options-button-option";
            uploader.innerHTML = "Continue an<br />editor file!";
            uploader.setAttribute("textOld", uploader.textContent);

            input.type = "file";
            input.className = "select-upload-input";
            input.onchange = this.handleFileDrop.bind(this, input, uploader);

            uploader.ondragenter = this.handleFileDragEnter.bind(this, uploader);
            uploader.ondragover = this.handleFileDragOver.bind(this, uploader);
            uploader.ondragleave = input.ondragend = this.handleFileDragLeave.bind(this, uploader);
            uploader.ondrop = this.handleFileDrop.bind(this, input, uploader);
            uploader.onclick = input.click.bind(input);

            uploader.appendChild(input);

            return uploader;
        }

        protected createMapSelectorDiv(schema: IOptionsEditorSchema): HTMLDivElement {
            var expanded: boolean = true,
                generatorName: string = "MapsGrid",
                container: HTMLDivElement = <HTMLDivElement>this.GameStarter.createElement(
                    "div",
                    {
                        "className": "select-options-group select-options-editor-maps-selector"
                    }),
                toggler: HTMLDivElement = <HTMLDivElement>this.GameStarter.createElement(
                    "div",
                    {
                        "className": "select-option select-option-large options-button-option"
                    }),
                mapsOut: HTMLDivElement = <HTMLDivElement>this.GameStarter.createElement(
                    "div",
                    {
                        "className": "select-options-holder select-options-editor-maps-holder"
                    }),
                mapsIn: HTMLDivElement = this.UserWrapper.getGenerators()[generatorName].generate(
                    this.GameStarter.proliferate(
                        {
                            "callback": schema.callback
                        },
                        schema.maps));

            toggler.onclick = function (event?: Event): void {
                expanded = !expanded;

                if (expanded) {
                    toggler.textContent = "(cancel)";
                    mapsOut.style.position = "";
                    mapsIn.style.height = "";
                } else {
                    toggler.innerHTML = "Edit a <br />built-in map!";
                    mapsOut.style.position = "absolute";
                    mapsIn.style.height = "0";
                }

                if (!container.parentElement) {
                    return;
                }

                [].slice.call(container.parentElement.children)
                    .forEach(function (element: HTMLElement): void {
                        if (element !== container) {
                            element.style.display = (expanded ? "none" : "block");
                        }
                    });
            };

            toggler.onclick(null);

            mapsOut.appendChild(mapsIn);
            container.appendChild(toggler);
            container.appendChild(mapsOut);

            return container;
        }

        protected handleFileDragEnter(uploader: HTMLDivElement, event: LevelEditr.IDataMouseEvent): void {
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = "copy";
            }
            uploader.className += " hovering";
        }

        protected handleFileDragOver(uploader: HTMLElement, event: MouseEvent): boolean {
            event.preventDefault();
            return false;
        }

        protected handleFileDragLeave(element: HTMLElement, event: LevelEditr.IDataMouseEvent): void {
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = "none";
            }
            element.className = element.className.replace(" hovering", "");
        }

        protected handleFileDrop(input: HTMLInputElement, uploader: HTMLDivElement, event: LevelEditr.IDataMouseEvent): void {
            var files: FileList = input.files || event.dataTransfer.files,
                file: File = files[0],
                reader: FileReader = new FileReader();

            this.handleFileDragLeave(input, event);
            event.preventDefault();
            event.stopPropagation();

            reader.onprogress = this.handleFileUploadProgress.bind(this, file, uploader);
            reader.onloadend = this.handleFileUploadCompletion.bind(this, file, uploader);

            reader.readAsText(file);
        }

        protected handleFileUploadProgress(file: File, uploader: HTMLDivElement, event: LevelEditr.IDataProgressEvent): void {
            var percent: number;

            if (!event.lengthComputable) {
                return;
            }

            percent = Math.round((event.loaded / event.total) * 100);

            if (percent > 100) {
                percent = 100;
            }

            uploader.innerText = "Uploading '" + file.name + "' (" + percent + "%)...";
        }

        protected handleFileUploadCompletion(file: File, uploader: HTMLDivElement, event: LevelEditr.IDataProgressEvent): void {
            this.GameStarter.LevelEditor.handleUploadCompletion(event);
            uploader.innerText = uploader.getAttribute("textOld");
        }
    }
}
