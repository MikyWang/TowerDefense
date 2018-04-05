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

    start() {

    }

    addTouchEventListening() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, event => {

        });
    }

}
