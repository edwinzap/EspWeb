import { InputOption } from "./inputOption.js";

export class Parameter {
    constructor(id?:number, label?:string, inputType?:InputType, value?:string) {
        this.id = id;
        this.label = label;
        this.inputType = inputType;
        this.value = value;
    }

    id:number;
    value:string;
    label:string;
    unit:string;
    inputType:InputType;
    options:InputOption[];
    description:string;
}

export enum InputType {
    Text,
    Number,
    Date,
    Radio,
    Select,
}