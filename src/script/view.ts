import { Data } from "./models/data.js";
import { Value } from "./models/value.js";
import { InputType, Parameter } from "./models/parameter.js";
import { Project } from "./project.js";

/**
 * "view.ts" contient les fonctions/éléments permettant d'initialiser et d'accéder aux éléments visuels de la page.
 */
export class View {

  dataTabLink: HTMLElement;
  parametersTabLink: HTMLElement;
  dataTabContent: HTMLElement;
  parametersTabContent: HTMLElement;
  dataView: HTMLDivElement;
  parametersView: HTMLDivElement;

  constructor() {
    this.init();
  }

  // Récupère les éléments de l'html suivant leurs ID
  private init(): void {
    console.log("view.init");
    this.initHtmlElements();
    this.initForProject();
  }

  private initHtmlElements() {
    this.dataTabLink = document.getElementById("tab-link-data");
    this.dataTabLink.addEventListener('click', () => this.onTabClicked("data"));
    this.parametersTabLink = document.getElementById("tab-link-parameters");
    this.parametersTabLink.addEventListener('click', () => this.onTabClicked("parameters"));

    this.dataTabContent = document.getElementById("tab-content-data");
    this.parametersTabContent = document.getElementById("tab-content-parameters");

    this.dataView = document.getElementById("view-data") as HTMLDivElement;
    this.parametersView = document.getElementById("view-parameters") as HTMLDivElement;
  }

  private initForProject() {
    var ptitle = document.getElementsByClassName("p-title");
    this.setInnerText(Project.title, ptitle)
  }

  private setInnerText(text: string, elements: HTMLCollectionOf<Element>) {
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      if (element instanceof HTMLElement) {
        element.innerText = text;
      }
    }
  }

  private setValue(value: string, element: HTMLElement): void {
    element.innerHTML = value;
  }

  private onTabClicked(id: string) {
    switch (id) {
      case "data":
        this.parametersTabLink.classList.remove("active");
        this.dataTabLink.classList.add("active");
        this.parametersTabContent.classList.add("is-hidden");
        this.dataTabContent.classList.remove("is-hidden");
        break;
      case "parameters":
        this.dataTabLink.classList.remove("active");
        this.parametersTabLink.classList.add("active");
        this.dataTabContent.classList.add("is-hidden");
        this.parametersTabContent.classList.remove("is-hidden");
        break;
    }
  }

  public createDataView(data: Data[]) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      let container = document.createElement('div') as HTMLDivElement;
      container.id = 'data-' + item.id;

      let label = document.createElement('span') as HTMLSpanElement;
      label.className = 'data-label';
      label.innerText = item.label + ": ";
      container.appendChild(label);

      let value = document.createElement('span') as HTMLSpanElement;
      value.className = 'data-value';
      value.innerText = item.value;
      container.appendChild(value);

      if (item.unit) {
        let unit = document.createElement('span') as HTMLSpanElement;
        unit.className = 'data-unit';
        unit.innerText = item.unit;
        container.appendChild(unit)
      }

      this.dataView.append(container);
    }
  }

  public createParametersView(parameters: Parameter[]) {
    for (let i = 0; i < parameters.length; i++) {
      const parameter = parameters[i];
      let pElement = document.createElement('p') as HTMLParagraphElement;

      let labelElement = document.createElement('label') as HTMLLabelElement;
      labelElement.className = 'parameter-label'
      labelElement.innerText = parameter.label;
      pElement.appendChild(labelElement);

      let optionsInput: InputType[] = [InputType.Radio, InputType.Select];

      const inputId = 'parameter-' + parameter.id;

      // Text, Number, Date
      if (!optionsInput.some(e => e == parameter.inputType)) {
        let inputElement = document.createElement('input') as HTMLInputElement;
        inputElement.id = inputId;
        inputElement.name = parameter.id.toString();
        inputElement.className = 'parameter-input';
        labelElement.htmlFor = inputId;
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

          pElement.appendChild(inputGroupElement);
        }
        else {
          pElement.appendChild(inputElement);
        }
      }
      // Select
      else if (parameter.inputType == InputType.Select) {
        let selectElement = document.createElement('select') as HTMLSelectElement;
        selectElement.id = inputId;
        selectElement.className = 'parameter-select';

        let defaultOption = document.createElement('option') as HTMLOptionElement;
        defaultOption.innerText = 'Sélectionner une option...';
        selectElement.appendChild(defaultOption);

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
        pElement.appendChild(selectElement);
      }
      // Radio
      else if (parameter.inputType == InputType.Radio) {
        let radioContainer = document.createElement('div') as HTMLDivElement;
        radioContainer.id = inputId;
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
          radioElement.name = inputId;

          if (option.value == parameter.value) {
            radioElement.checked = true;
          }

          radioContainer.appendChild(radioElement);
          radioContainer.appendChild(radioLabelElement);
        }

        pElement.appendChild(radioContainer);
      }

      this.parametersView.appendChild(pElement);
    }
  }

  public updateDataValue(value: Value) {
    const id = 'data-' + value.id;
    let dataValue = document.getElementById(id)?.getElementsByClassName('data-value')[0] as HTMLSpanElement;
    if (dataValue) {
      dataValue.innerText = value.value;
    }
  }
}
