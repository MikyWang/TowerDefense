const { ccclass, property } = cc._decorator;

@ccclass
export default class Tooltip extends cc.Component {

    @property(cc.Node)
    labelNode: cc.Node = null;

    public set LabelString(value: string) {
        let label = this.labelNode.getComponent(cc.Label);
        label.string = value;
    }

    public get LabelString(): string {
        let label = this.labelNode.getComponent(cc.Label);
        return label.string;
    }

    start() {
        this.scheduleOnce(() => {
            if (this.node.isValid) {
                this.node.destroy();
            }
        }, 1.5)
    }

}
