import { TouchKeeper } from "./TouchKeeper";
import Camera from "./Camera";
import Session from "./Session";
import TileHelper from "./TileHelper";
import TouchListener from "./TouchListener";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends TouchListener {

    @property(cc.TiledMap)
    map: cc.TiledMap = null;
    @property(cc.TiledLayer)
    backGroundLayer: cc.TiledLayer = null;
    @property(cc.Vec2)
    MonsterEnd: cc.Vec2 = null;
    @property(cc.Node)
    cameraNode: cc.Node = null;
    @property(cc.Prefab)
    tooltipPrefab: cc.Prefab = null;

    private monsters: cc.Node[] = [];

    start() {
        this.addEventListening();
    }

    protected oneFingerHandler() {
        if (!Session.CurrentSelectedNode) return;
        Session.CurrentSelectedNode.parent.emit(Session.EventType.PLAYER_MOVED, { tile: this.fingerTouchs.pop() });
    }

    protected twoFingersHandler() {
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

    protected addEventListening() {
        super.addEventListening();
        this.node.on(Session.EventType.MONSTER_PREPARED, event => {
            let firMonsterPrefab = Session.MonsterPrefabs.pop();
            Session.loadRes(firMonsterPrefab.url, (err, prefab) => {
                if (err) throw err;
                let mapSize = this.map.getMapSize();
                this.schedule(() => {
                    let firMonster = cc.instantiate(prefab) as cc.Node;
                    let position = this.backGroundLayer.getPositionAt(0, 0);
                    firMonster.setPosition(position);
                    this.node.addChild(firMonster);
                }, 1, 39);
            })
        });
    }

}
