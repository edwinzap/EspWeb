import { Parameter } from "./models/parameter.js";
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
  private readonly webSocketGateway = `ws://${window.location.hostname}/parameters`; // The gateway is the entry point to the WebSocket interface. window.location.hostname gets the current page address (the web server IP address).
  private webSocketHelper: WebSocketHelper<Array<Parameter>>;

  constructor() {
    console.log("constructor from controller");
    this.init();
  }

  private init() {
    this.webSocketHelper = new WebSocketHelper(this.webSocketGateway);
    this.webSocketHelper.bindMessageEvent = (data) => this.onParametersWebSocketDataReceived(data);
    this.webSocketHelper.bindOnOpen = () => this.onParametersWebSocketOpen();
    this.view = new View();
  }
  private onParametersWebSocketOpen(){
    //onOpen
  }

  private onSubmitParameters(parameters: Array<Value>): void {
    console.log("handleSubmit");
    let message: string;
    message = JSON.stringify(parameters),
    this.webSocketHelper.send(message);
  }

  private onParametersWebSocketDataReceived(data: Array<Value>): void {
    //handle message 
  }
}
