const { ccclass, property } = cc._decorator;

@ccclass
export default class Camera extends cc.Component {

    @property(cc.Node)
    playerNode: cc.Node = null;

    private readonly unit: number = 1000;
    private cameraNode: cc.Camera = null;

    start() {
        this.cameraNode = this.node.getComponent(cc.Camera);
        this.node.setPosition(this.playerNode.position);
    }

    update(dt: number) {
    }

    scaling(leftDelta: cc.Vec2, rightDelta: cc.Vec2) {
        if (leftDelta.x == 0 && rightDelta.x == 0) return;
        if (leftDelta.x * rightDelta.x > 0) return;
        let ratio = Math.floor(Math.abs(leftDelta.x) + Math.abs(rightDelta.x)) / this.unit;
        if (ratio < 0.1) ratio = 0.1;
        if (ratio > 1) ratio = 1;
        if (leftDelta.x < 0 || rightDelta.x > 0) {
            this.cameraNode.zoomRatio = this.cameraNode.zoomRatio + ratio > 1 ? 1 : this.cameraNode.zoomRatio + ratio;
        } else {
            this.cameraNode.zoomRatio = this.cameraNode.zoomRatio - ratio < 0.5 ? 0.5 : this.cameraNode.zoomRatio - ratio;
        }
    }

}
