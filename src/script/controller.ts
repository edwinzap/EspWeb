import { Data } from "./models/data.js";
import { InputOption } from "./models/inputOption.js";
import { InputType, Parameter } from "./models/parameter.js";
import { Value } from "./models/value.js";
import { View } from "./view.js";
import { WebSocketHelper } from "./websockethelper.js";

/*
Commandes:
Execute Run Build Task Ctrl+Shift+B and select tsc: watch-.... => pour générer automatiquement les fichier js
*/

/**
 * Le "controller.ts" est l'élément principal. Il initialise et gère la logique de fonctionnement
 * de toute la page en utilisant les fonctions disponibles dans "view.ts","model.ts,..."
 */
export class Controller {
  private view: View;
  private readonly wsDataViewPath = `ws://${window.location.hostname}/data-view`;
  private readonly wsDataValuePath = `ws://${window.location.hostname}/data-value`;
  private readonly wsParametersViewPath = `ws://${window.location.hostname}/parameters-view`;
  private wsDataView: WebSocketHelper<Data[]>;
  private wsDataValue: WebSocketHelper<Value>;
  private wsParametersView: WebSocketHelper<Parameter[]>;

  constructor() {
    console.log("constructor from controller");
    this.init();
    this.fake();
  }

  private init() {
    //this.initWebSockets();
    this.view = new View();
    this.bindView();
  }

  private bindView() {
    this.view.onParametersFormSubmit = this.onParametersSubmit;
  }

  private initWebSockets() {
    this.wsDataView = new WebSocketHelper(this.wsDataViewPath);
    this.wsDataView.bindMessageEvent = (data) => this.onWsDataViewReceived(data);
    //this.wsDataView.bindOnOpen = () => this.onParametersWebSocketOpen();

    this.wsDataValue = new WebSocketHelper(this.wsDataValuePath);
    this.wsDataValue.bindMessageEvent = (value) => this.onWsDataValueReceived(value);
    //this.wsDataValue.bindOnOpen = () => this.onParametersWebSocketOpen();

    this.wsParametersView = new WebSocketHelper(this.wsParametersViewPath);
    this.wsParametersView.bindMessageEvent = (parameters) => this.onWsParametersViewReceived(parameters);
    //this.wsParametersView.bindOnOpen = () => this.onParametersWebSocketOpen();
  }

  private onWsDataViewReceived(data: Data[]) {
    this.view.createDataView(data);
  }

  private onWsDataValueReceived(value: Value) {
    this.view.updateDataValue(value);
  }

  private onWsParametersViewReceived(parameters: Parameter[]) {
    this.view.createParametersView(parameters);
  }

  private onParametersSubmit(values: Value[]) {
    console.log("Parameters send");
    console.log(values);
  }

  //#region Fake
  private fake() {
    this.onWsDataViewReceived(this.generateFakeData());
    this.onWsParametersViewReceived(this.generateFakeParameters());
    setInterval(() => {
      const value = 100 + Math.floor(Math.random() * 100);
      this.onWsDataValueReceived(new Value(3, value.toString()))
    }, 5000)
  }

  private generateFakeData(): Data[] {
    let data: Data[] = [];

    let data1 = new Data(1, 'Prénom', 'Miguel');
    let data2 = new Data(2, 'Nom', 'Forget');
    let data3 = new Data(3, 'Taille', '172');
    data3.unit = 'cm';

    data.push(data1, data2, data3);
    return data;
  }

  private generateFakeParameters(): Parameter[] {
    let parameters: Parameter[] = [];

    let parameter1 = new Parameter(1, 'Prénom', InputType.Text, 'Miguel');

    let parameter2 = new Parameter(2, 'Nom', InputType.Text, 'Forget');

    let parameter3 = new Parameter(3, 'Taille', InputType.Number, '172');
    parameter3.unit = "cm";

    let parameter4 = new Parameter(4, 'Date de naissance', InputType.Date, "1995-05-09");

    let parameter5 = new Parameter(5, 'Pays', InputType.Select, "BE");
    parameter5.options = [
      new InputOption("FR", "France"),
      new InputOption("BE", "Belgique"),
      new InputOption("LU", "Luxembourg"),
      new InputOption("DE", "Allemagne")
    ];

    let parameter6 = new Parameter(6, 'Sexe', InputType.Radio, "m");
    parameter6.options = [
      new InputOption("f", "Femme"),
      new InputOption("m", "Homme"),
    ];

    parameters.push(parameter1, parameter2, parameter3, parameter4, parameter5, parameter6);
    return parameters;
  }
  //#endregion
}