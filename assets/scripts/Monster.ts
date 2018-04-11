import Session from "./Session";
import Game from "./Game";
import TileHelper from "./TileHelper";
import { MonsterState } from "./enum";
import CommonHelper from "./CommonHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Monster extends cc.Component {

    @property(cc.Float)
    duration: number = 0;
    @property(cc.Integer)
    Health: number = 0;
    @property(cc.Integer)
    Defense: number = 0;

    private moveState: MonsterState = MonsterState.None;
    private game: Game = null;
    private currentAction: cc.Action = null;
    private minPathTiles: cc.Vec2[];

    tilePosition: cc.Vec2 = null;
    movePosition: cc.Vec2 = null;
    animation: cc.Animation = null;

    public get MoveState() {
        return this.moveState;
    }

    public set MoveState(value: MonsterState) {
        this.moveState = value;
        if (value != MonsterState.None) {
            this.movePosition = this.game.backGroundLayer.getPositionAt(this.tilePosition);
            let aniName = CommonHelper.getEnumName(MonsterState, value);
            if (!this.animation.getAnimationState(aniName).isPlaying) {
                this.animation.play(aniName);
            }
            this.currentAction = this.node.runAction(this.moveAction());
        }
    }

    update(dt: number) {
        if (this.MoveState == MonsterState.None && this.minPathTiles.length > 0) {
            this.MoveState = this.calculateNextStep(this.minPathTiles.pop());
        }
    }

    start() {
        this.game = Session.currentGameInstance();
        this.animation = this.node.getComponent(cc.Animation);
        this.tilePosition = TileHelper.getTilePos(this.node.position);

        this.minPathTiles = CommonHelper.AStartSearchPath(this.tilePosition, this.game.MonsterEnd, this.isValidPath.bind(this));
    }

    moveAction(): cc.Action {
        let move = cc.moveTo(this.duration, cc.p(this.movePosition.x, this.movePosition.y));
        let callback = cc.callFunc(() => {
            this.moveState = MonsterState.None;
        })
        return cc.sequence(move, callback);
    }

    calculateNextStep(tile: cc.Vec2): MonsterState {
        let state = null;
        if (tile.x > this.tilePosition.x && tile.y == this.tilePosition.y)
            state = MonsterState.Right;
        else if (tile.x < this.tilePosition.x && tile.y == this.tilePosition.y)
            state = MonsterState.Left;
        else if (tile.x == this.tilePosition.x && tile.y < this.tilePosition.y)
            state = MonsterState.Back;
        else if (tile.x == this.tilePosition.x && tile.y > this.tilePosition.y)
            state = MonsterState.Front;
        else if (tile.x == this.tilePosition.x && tile.y == this.tilePosition.y)
            state = MonsterState.None;
        this.tilePosition = CommonHelper.shallowCopy(cc.Vec2, tile);
        return state;
    }

    isValidPath(tile: cc.Vec2): boolean {
        let type = TileHelper.getTileType(this.game.backGroundLayer, tile);
        return type == TileHelper.MonsterTileType;
    }
}
