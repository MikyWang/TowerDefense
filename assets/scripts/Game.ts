import { TouchKeeper } from "./TouchKeeper";
import Camera from "./Camera";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.TiledMap)
    map: cc.TiledMap = null;
    @property(cc.TiledLayer)
    backGroundLayer: cc.TiledLayer = null;
    @property(cc.TiledLayer)
    monsterGroundLayer: cc.TiledLayer = null;
    @property(cc.Vec2)
    MonsterEnd: cc.Vec2 = null;
    @property(cc.Node)
    cameraNode: cc.Node = null;

    private fingerTouchs: TouchKeeper[] = new Array<TouchKeeper>();
    private touchCount: number = 0;

    start() {
        this.addTouchEventListening();
    }

    private TwoFingersHandler() {
        let leftFinger: TouchKeeper = null;
        let rightFinger: TouchKeeper = null;
        if (this.fingerTouchs[0].startPosition.x == this.fingerTouchs[1].startPosition.x) {
            leftFinger = this.fingerTouchs[0].startPosition.y > this.fingerTouchs[1].startPosition.y ? this.fingerTouchs[0] : this.fingerTouchs[1];
            rightFinger = this.fingerTouchs[0].startPosition.y < this.fingerTouchs[1].startPosition.y ? this.fingerTouchs[0] : this.fingerTouchs[1];
        }
        else {
            leftFinger = this.fingerTouchs[0].startPosition.x < this.fingerTouchs[1].startPosition.x ? this.fingerTouchs[0] : this.fingerTouchs[1];
            rightFinger = this.fingerTouchs[0].startPosition.x > this.fingerTouchs[1].startPosition.x ? this.fingerTouchs[0] : this.fingerTouchs[1];
        }
        let leftDelta = leftFinger.calculateDelta();
        let rightDelta = rightFinger.calculateDelta();
        let camera = this.cameraNode.getComponent(Camera);
        camera.scaling(leftDelta, rightDelta);

    }

    private TouchStartHandler(event: cc.Event.EventTouch) {
        this.touchCount++;
        let touchKeeper = new TouchKeeper(event.getID(), event.getLocation());
        this.fingerTouchs.push(touchKeeper);
    }

    private TouchEndHandler(event: cc.Event.EventTouch) {
        this.fingerTouchs.forEach(touchKeeper => {
            if (touchKeeper.touchID == event.getID()) {
                touchKeeper.EndPosition = event.getLocation();
            }
        });
        this.touchCount--;
        cc.log("count:" + this.touchCount);
        if (this.touchCount == 0 && this.fingerTouchs.length > 0) {
            cc.log("length:" + this.fingerTouchs.length);
            switch (this.fingerTouchs.length) {
                case 1:
                    break;
                case 2:
                    this.TwoFingersHandler();
                    break;
            }
            this.fingerTouchs.splice(0, this.fingerTouchs.length);
        }
    }

    addTouchEventListening() {
        this.node.on(cc.Node.EventType.TOUCH_START, event => {
            if (event instanceof cc.Event.EventTouch) {
                this.TouchStartHandler(event);
            }
        });
        this.node.on(cc.Node.EventType.TOUCH_END, event => {
            if (event instanceof cc.Event.EventTouch) {
                this.TouchEndHandler(event);
            }
        });
    }

}
