const { ccclass, property } = cc._decorator;

@ccclass
export default class Camera extends cc.Component {

    start() {
        let camera = this.node.getComponent(cc.Camera);
    }

    update(dt: number) {
    }



}
