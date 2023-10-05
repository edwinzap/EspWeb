import { Value } from "./value.js";

export class Parameter {
    id:number;
    value:object;
    label:string;
    unit:string;
    inputType:InputType;
    options:Array<Value>;
    description:string;
}

export enum InputType {
    text,
    number,
    date,
    radio,
    select,
}