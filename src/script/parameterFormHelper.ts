import { InputType, Parameter } from "./models/parameter.js";

export class ParameterFormHelper {
    public listener:OnParameterChanged;

    public getParameterElement(parameter: Parameter): HTMLElement {
        let pElement = document.createElement('p') as HTMLParagraphElement;

        let labelElement = document.createElement('label') as HTMLLabelElement;
        labelElement.className = 'parameter-label'
        labelElement.innerText = parameter.label;
        pElement.appendChild(labelElement);

        let optionsInput: InputType[] = [InputType.Radio, InputType.Select];

        let inputElement: HTMLElement;
        // Text, Number, Date
        if (!optionsInput.some(e => e == parameter.inputType)) {
            inputElement = this.createInputForParameter(parameter);
            labelElement.htmlFor = this.getInputId(parameter.id);
        }
        // Select
        else if (parameter.inputType == InputType.Select) {
            inputElement = this.createSelectForParameter(parameter);
        }
        // Radio
        else if (parameter.inputType == InputType.Radio) {
            inputElement = this.createRadioForParameter(parameter);
        }

        pElement.appendChild(inputElement);
        return pElement;
    }

    private getInputId(id: number): string {
        return 'parameter-' + id;
    }

    private createInputForParameter(parameter: Parameter): HTMLElement {
        let inputElement = document.createElement('input') as HTMLInputElement;
        inputElement.id = this.getInputId(parameter.id);
        inputElement.name = parameter.id.toString();
        inputElement.className = 'parameter-input';
        inputElement.oninput = () => this.listener?.onParametersChanged(parameter.id);

        if (parameter.value) {
            inputElement.value = parameter.value;
        }

        switch (parameter.inputType) {
            case InputType.Text:
                inputElement.type = 'text'
                break;
            case InputType.Date:
                inputElement.type = 'date';
                break;
            case InputType.Number:
                inputElement.type = 'number';
        }

        if (parameter.unit) {
            let inputGroupElement = document.createElement('div') as HTMLDivElement;
            inputGroupElement.className = 'input-group';

            let inputAppendElement = document.createElement('div') as HTMLDivElement;
            inputAppendElement.className = 'input-group-append';

            let spanAppendElement = document.createElement('span') as HTMLSpanElement;
            spanAppendElement.innerText = parameter.unit;
            spanAppendElement.className = "input-group-text"

            inputAppendElement.appendChild(spanAppendElement);

            inputGroupElement.appendChild(inputElement);
            inputGroupElement.appendChild(inputAppendElement);

            return inputGroupElement;
        }
        else {
            return inputElement;
        }
    }

    private createRadioForParameter(parameter: Parameter): HTMLElement {
        let radioContainer = document.createElement('div') as HTMLDivElement;
        radioContainer.id = this.getInputId(parameter.id);
        radioContainer.className = 'parameter-input radio-container';

        for (let i = 0; i < parameter.options.length; i++) {
            const option = parameter.options[i];
            const radioId = 'parameter-radio-' + option.value;

            let radioLabelElement = document.createElement('label') as HTMLLabelElement;
            radioLabelElement.innerText = option.text;
            radioLabelElement.htmlFor = radioId;

            let radioElement = document.createElement('input') as HTMLInputElement;
            radioElement.id = radioId;
            radioElement.type = 'radio';
            radioElement.value = option.value;
            radioElement.name = this.getInputId(parameter.id);
            radioElement.onchange = () => this.listener?.onParametersChanged(parameter.id);

            if (option.value == parameter.value) {
                radioElement.checked = true;
            }

            radioContainer.appendChild(radioElement);
            radioContainer.appendChild(radioLabelElement);
        }
        return radioContainer;
    }

    private createSelectForParameter(parameter: Parameter): HTMLElement {

        let selectElement = document.createElement('select') as HTMLSelectElement;
        selectElement.id = this.getInputId(parameter.id);
        selectElement.className = 'parameter-input';

        let defaultOption = document.createElement('option') as HTMLOptionElement;
        defaultOption.innerText = 'Sélectionner une option...';
        selectElement.appendChild(defaultOption);
        selectElement.oninput= () => this.listener?.onParametersChanged(parameter.id);

        for (let i = 0; i < parameter.options.length; i++) {
            const option = parameter.options[i];
            let optionElement = document.createElement('option') as HTMLOptionElement;
            optionElement.value = option.value;
            optionElement.innerText = option.text;
            if (option.value == parameter.value) {
                optionElement.selected = true;
            }
            selectElement.appendChild(optionElement);
        }

        return selectElement;
    }
}

export interface OnParameterChanged {
    onParametersChanged(id:number):void;
}