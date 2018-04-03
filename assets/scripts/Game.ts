const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.TiledMap)
    map: cc.TiledMap = null;
    @property(cc.TiledLayer)
    backGroundLayer: cc.TiledLayer = null;
    @property(cc.TiledLayer)
    monsterGroundLayer: cc.TiledLayer = null;

    start() {

    }

}
