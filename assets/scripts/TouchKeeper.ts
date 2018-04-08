export class TouchKeeper {

    readonly touchID: number;
    readonly startPosition: cc.Vec2;
    private endPosition: cc.Vec2;

    constructor(touchID: number, startPosition: cc.Vec2) {
        this.touchID = touchID;
        this.startPosition = startPosition;
    }

    public set EndPosition(endPosition: cc.Vec2) {
        this.endPosition = endPosition;
    }

    public get EndPosition() {
        return this.endPosition;
    }

    public calculateDelta(): cc.Vec2 {
        let deltaX = this.endPosition.x - this.startPosition.x;
        let deltaY = this.endPosition.y - this.startPosition.y;
        return cc.p(deltaX, deltaY);
    }

    public toString() {
        let str = "touchID:" + this.touchID + "触摸起始坐标x:" + this.startPosition.x + "y:" + this.startPosition.y;
        if (this.EndPosition) {
            str += "触摸结束坐标x:" + this.EndPosition.x + "y:" + this.EndPosition.y;
        }
        return str;
    }

}