import Game from "./Game";
import Session from "./Session";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TileHelper extends cc.Component {

    static readonly MonsterTileType: string = 'ground';

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

    static getInterfacingTile(tile: cc.Vec2): cc.Vec2[] {
        let mapSize = Session.currentGameInstance().map.getMapSize();
        let tiles: cc.Vec2[] = [];
        tiles.push(cc.p(tile.x + 1, tile.y));
        tiles.push(cc.p(tile.x, tile.y + 1));
        tiles.push(cc.p(tile.x - 1, tile.y));
        tiles.push(cc.p(tile.x, tile.y - 1));
        return tiles.filter(tile => tile.x >= 0 && tile.y >= 0 && tile.x < mapSize.width && tile.y < mapSize.height);
    }

    static getActPosition(position: cc.Vec2): cc.Vec2 {
        let cameraNode = Session.currentCameraInstance().node.getComponent(cc.Camera);
        return cc.p(position.x / cameraNode.zoomRatio, position.y / cameraNode.zoomRatio);
    }
}
