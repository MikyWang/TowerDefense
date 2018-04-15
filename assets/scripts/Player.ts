import TouchListener from "./TouchListener";
import Session from "./Session";
import { TouchKeeper } from "./TouchKeeper";
import CommonHelper from "./CommonHelper";
import TileHelper from "./TileHelper";
import { PlayerState } from "./Enum";
import InfoPanel from "./InfoPanel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property(cc.Float)
    duration: number = 0;

    private tilePosition: cc.Vec2 = null;
    private movePosition: cc.Vec2 = null;
    private minPathTiles: cc.Vec2[] = [];
    private currentAction: cc.Action = null;

    state: PlayerState = PlayerState.None;

    public get InfoPanel(): InfoPanel {
        return this.getComponent(InfoPanel);
    }

    update(dt: number) {
        if (this.state == PlayerState.None && this.minPathTiles.length > 0) {
            this.calculateNextStep(this.minPathTiles.pop());
        }
    }

    start() {
        this.tilePosition = TileHelper.getTilePos(this.node.position);
        this.addEventListening();
    }

    private calculateNextStep(tile: cc.Vec2) {
        let game = Session.currentGameInstance();

        if (tile.x > this.tilePosition.x && tile.y == this.tilePosition.y)
            this.state = PlayerState.Right;
        else if (tile.x < this.tilePosition.x && tile.y == this.tilePosition.y)
            this.state = PlayerState.Left;
        else if (tile.x == this.tilePosition.x && tile.y < this.tilePosition.y)
            this.state = PlayerState.Back;
        else if (tile.x == this.tilePosition.x && tile.y > this.tilePosition.y)
            this.state = PlayerState.Front;
        else if (tile.x == this.tilePosition.x && tile.y == this.tilePosition.y)
            this.state = PlayerState.None;
        this.tilePosition = CommonHelper.shallowCopy(cc.Vec2, tile);

        if (this.state != PlayerState.None) {
            this.movePosition = game.backGroundLayer.getPositionAt(this.tilePosition);
            let aniName = CommonHelper.getEnumName(PlayerState, this.state);
            this.InfoPanel.playAnimation(aniName);
            this.currentAction = this.node.runAction(this.moveAction());
        }
    }

    moveAction(): cc.Action {
        let move = cc.moveTo(this.duration, cc.p(this.movePosition.x, this.movePosition.y));
        let callback = cc.callFunc(() => {
            this.state = PlayerState.None;
        })
        return cc.sequence(move, callback);
    }

    protected addEventListening() {
        this.node.on(Session.EventType.PLAYER_MOVED, ((event) => {
            let touchKeep = event.detail.tile as TouchKeeper;
            let endTile = TileHelper.getTilePos(TileHelper.getActPosition(touchKeep.EndPosition));
            this.minPathTiles = CommonHelper.AStartSearchPath(this.tilePosition, endTile, (tile) => true);
        }).bind(this));
    }

}
