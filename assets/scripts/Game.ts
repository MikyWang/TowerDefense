import { TouchKeeper } from "./TouchKeeper";

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

    private twoFingerTouchs: TouchKeeper[] = new Array<TouchKeeper>();

    start() {
        this.addTouchEventListening();
    }

    private towFingerTouchStartHandler(touchs: cc.Event.EventTouch[]) {
        this.twoFingerTouchs.splice(0, this.twoFingerTouchs.length);
        touchs.forEach(touch => {
            let touchKeeper = new TouchKeeper(touch.getID(), touch.getLocation());
            this.twoFingerTouchs.push(touchKeeper);
        });
    }

    private towFingerTouchEndHandler(touchs: cc.Event.EventTouch[]) {
        if (this.twoFingerTouchs.length < 1) return;
        touchs.forEach(touch => {
            this.twoFingerTouchs.forEach(touchKeeper => {
                if (touchKeeper.touchID == touch.getID()) {
                    touchKeeper.EndPosition = touch.getLocation();
                }
            });
        });

    }

    addTouchEventListening() {
        this.node.on(cc.Node.EventType.TOUCH_START, event => {
            if (event instanceof cc.Event.EventTouch) {
                let touchs = event.getTouches() as cc.Event.EventTouch[];
                if (touchs.length == 2) {
                    this.towFingerTouchStartHandler(touchs);
                }
            }
        });
        this.node.on(cc.Node.EventType.TOUCH_END, event => {
            if (event instanceof cc.Event.EventTouch) {
                let touchs = event.getTouches() as cc.Event.EventTouch[];
                if (touchs.length == 2) {
                    this.towFingerTouchEndHandler(touchs);
                }
            }
        });
    }

}
