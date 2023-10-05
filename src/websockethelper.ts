export class WebSocketHelper<T> {
  private gateway: string;
  private websocket: WebSocket;

  bindMessageEvent: (data: T) => void;
  bindOnOpen: () => void;

  constructor(gateway: string) {
    this.gateway = gateway;
    this.init();
  }

  private init(): void {
    console.log("Trying to open a WebSocket connection...");
    this.websocket = new WebSocket(this.gateway);
    this.websocket.onopen = () => this.onOpen();
    this.websocket.onclose = () => this.onClose();
    this.websocket.onmessage = (message) => this.onMessage(message);
  }

  private onOpen(): void {
    console.log("WebSocket connection opened");
    this.bindOnOpen();
  }

  private onClose(): void {
    console.log("WebSocket connection closed");
    setTimeout(this.init, 2000);
  }

  private onMessage(event: { data: string }): void {
    console.log("WebSocket message received");
    let dataFromServer = JSON.parse(event.data);
    this.bindMessageEvent(dataFromServer);
  }

  send(message: string): void {
    let jsonMessage: string;
    jsonMessage = message;
    console.log(jsonMessage);
    this.websocket.send(jsonMessage);
  }
}
