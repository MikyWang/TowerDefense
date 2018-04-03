import Game from "./Game";
import Session from "./Session";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TileHelper extends cc.Component {

    static getTilePos(position: cc.Vec2): cc.Vec2 {
        let game = Session.currentGameInstance();
        let mapSize = game.map.node.getContentSize();
        let tileSize = game.map.getTileSize();
        let x = Math.floor(position.x / tileSize.width);
        let y = Math.floor((mapSize.height - position.y) / tileSize.height) - 1;
        return cc.p(x, y);
    }

    static getTileType(layer: cc.TiledLayer, tile: cc.Vec2): string {
        let game = Session.currentGameInstance();
        let tileGID = layer.getTileGIDAt(tile);
        let prop = game.map.getPropertiesForGID(tileGID);
        return prop ? prop.type : null;
    }
}
