const { ccclass, property } = cc._decorator;

@ccclass
export default class CommonHelper extends cc.Component {

    static shallowCopy<T>(type: { new(): T }, src: T): T {
        let dst = new type();
        if (dst instanceof Array && src instanceof Array) {
            for (const value of src) {
                dst.push(value);
            }
        } else {
            for (let prop in src) {
                if (src.hasOwnProperty(prop)) {
                    dst[prop] = src[prop];
                }
            }
        }
        return dst;
    }

    static getEnumName<T>(type: any, eWord: T): string {
        return type[eWord].toString().toLowerCase();
    }
}
