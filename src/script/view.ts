import { Project } from "./project.js";

/**
 * "view.ts" contient les fonctions/éléments permettant d'initialiser et d'accéder aux éléments visuels de la page.
 */
export class View {

  constructor() {
    this.init();
  }

  // Récupère les éléments de l'html suivant leurs ID
  private init(): void {
    console.log("view.init");
    this.initForProject();
  }

  private initForProject(){
    console.log("Replace projectname")
    var ptitle = document.getElementsByClassName("p-title");
    this.setInnerText(Project.title, ptitle)
  }

  private setInnerText(text:string, elements: HTMLCollectionOf<Element>){
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
}
