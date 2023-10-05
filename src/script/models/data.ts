export class Data {
    constructor(id?:number, label?:string, value?:string) {
        this.id = id;
        this.label = label;
        this.value = value;
    }

    id:number;
    value:string;
    label:string;
    unit:string;
    description:string;
}