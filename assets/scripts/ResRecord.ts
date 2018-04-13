export default class ResRecord<T>{

    public readonly name: string;
    public readonly resource: T;

    constructor(name: string, resource: T) {
        this.name = name;
        this.resource = resource;
    }

}