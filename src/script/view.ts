import { Data } from "./models/data.js";
import { Value } from "./models/value.js";
import { Parameter } from "./models/parameter.js";
import { Project } from "./project.js";
import { OnParameterChanged, ParameterFormHelper } from "./parameterFormHelper.js";

/**
 * "view.ts" contient les fonctions/éléments permettant d'initialiser et d'accéder aux éléments visuels de la page.
 */
export class View implements OnParameterChanged {

  public onParametersFormSubmit: (values: Value[]) => void;

  private dataTabLink: HTMLElement;
  private parametersTabLink: HTMLElement;
  private dataTabContent: HTMLElement;
  private parametersTabContent: HTMLElement;
  private dataView: HTMLDivElement;
  private parametersView: HTMLDivElement;

  private parametersSubmit: HTMLInputElement;
  private parameterFormHelper:ParameterFormHelper;

  constructor() {
    this.init();
  }

  private init(): void {
    this.parameterFormHelper = new ParameterFormHelper();
    this.parameterFormHelper.listener = this;
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

  public onParametersChanged(id:number): void {
    this.canSubmitParameters(true);
  }

  private canSubmitParameters(canSubmit: boolean) {
    if (this.parametersSubmit) {
      this.parametersSubmit.disabled = !canSubmit;
    }
  }

  public createParametersView(parameters: Parameter[]) {
    let formElement = document.createElement('form') as HTMLFormElement;

    for (let i = 0; i < parameters.length; i++) {
      const parameter = parameters[i];
      const element = this.parameterFormHelper.getParameterElement(parameter);

      formElement.appendChild(element);
    }
    this.parametersSubmit = document.createElement('input') as HTMLInputElement;
    this.parametersSubmit.type = 'submit';
    this.parametersSubmit.innerText = "Valider"

    formElement.appendChild(this.parametersSubmit);
    formElement.onsubmit = (event) => {
      event.preventDefault();
      this.submitParametersForm();
    }
    this.parametersView.appendChild(formElement);
  }

  private submitParametersForm() {
    console.log("Submit form");
    let inputs = this.parametersView.getElementsByClassName('parameter-input');
    let values: Value[] = [];

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const parameterId = Number.parseInt(input.id.split('-')[1]);
      let value: string;

      if (input.classList.contains('radio-container')) {
        const radios = input.getElementsByTagName('input');
        value = Array.from(radios).find(radio => (radio as HTMLInputElement).checked).value;
      }
      else {
        if (input instanceof HTMLInputElement) {
          value = input.value;
        }
        else if (input instanceof HTMLSelectElement) {
          value = input.value;
        }
      }
      const parameterValue = new Value(parameterId, value);
      values.push(parameterValue);
    }
    this.onParametersFormSubmit(values);
    this.canSubmitParameters(false);
  }

  public updateDataValue(value: Value) {
    const id = 'data-' + value.id;
    let dataValue = document.getElementById(id)?.getElementsByClassName('data-value')[0] as HTMLSpanElement;
    if (dataValue) {
      dataValue.innerText = value.value;
    }
  }
}
