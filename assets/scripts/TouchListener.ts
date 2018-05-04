import { TouchKeeper } from "./TouchKeeper";
import Session from "./Session";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TouchListener extends cc.Component {

    protected touchCount: number = 0;
    protected fingerTouchs: TouchKeeper[] = [];

    protected TouchStartHandler(event: cc.Event.EventTouch) {
        this.touchCount++;
        let touchKeeper = new TouchKeeper(event.getID(), event.getLocation());
        this.fingerTouchs.push(touchKeeper);
    }

    protected TouchEndHandler(event: cc.Event.EventTouch) {
        this.fingerTouchs.forEach(touchKeeper => {
            if (touchKeeper.touchID == event.getID()) {
                touchKeeper.EndPosition = event.getLocation();
            }
        });
        this.touchCount--;
        if (this.touchCount == 0 && this.fingerTouchs.length > 0) {
            switch (this.fingerTouchs.length) {
                case 1:
                    this.oneFingerHandler();
                    break;
                case 2:
                    this.twoFingersHandler();
                    break;
            }
            this.fingerTouchs.splice(0, this.fingerTouchs.length);
        }
    }

    protected oneFingerHandler() {
    }

    protected twoFingersHandler() {
    }

    protected addEventListening(node: cc.Node) {
        node.on(cc.Node.EventType.TOUCH_START, event => {
            if (event instanceof cc.Event.EventTouch) {
                this.TouchStartHandler(event);
            }
        });
        node.on(cc.Node.EventType.TOUCH_END, event => {
            if (event instanceof cc.Event.EventTouch) {
                this.TouchEndHandler(event);
            }
        });
    }
}
