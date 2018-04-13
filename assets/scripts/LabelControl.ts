import TouchListener from "./TouchListener";
import Session from "./Session";
import CommonHelper from "./CommonHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LabelControl extends TouchListener {

    @property(cc.String)
    detail: string = '';

    private initWidth: number = 0;


    protected oneFingerHandler() {
        Session.generateTooltip(this.node.convertToWorldSpace(cc.p(0, 0)), this.detail);
    }

    private set LabelString(value: string) {
        let label = this.getComponent(cc.Label);

        let maxLength = Math.floor((this.initWidth / label.fontSize) * 2);
        let valueLength = CommonHelper.getByteLength(value);
        if (valueLength > maxLength) {
            if (valueLength > value.length) {
                label.string = value.slice(0, value.length - 5) + `..`;
            } else {
                label.string = value.slice(0, value.length - 1) + `..`;
            }
        } else {
            label.string = value;
        }
    }

    private get LabelString(): string {
        return this.detail;
    }

    start() {
        this.initWidth = this.node.width;
        this.LabelString = this.detail;
        this.addEventListening();
    }

}
