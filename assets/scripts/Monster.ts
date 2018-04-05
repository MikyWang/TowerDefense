import CommonHelper, { MonsterState } from "./CommonHelper";
import Session from "./Session";
import Game from "./Game";
import TileHelper from "./TileHelper";

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
    private preTile: cc.Vec2 = null;

    tilePosition: cc.Vec2 = null;
    movePosition: cc.Vec2 = null;
    animation: cc.Animation = null;

    public get MoveState() {
        return this.moveState;
    }

    public set MoveState(value: MonsterState) {
        this.preTile = CommonHelper.shallowCopy(cc.Vec2, this.tilePosition);
        this.moveState = value;
        switch (value) {
            case MonsterState.Front:
                this.tilePosition.y++;
                break;
            case MonsterState.Back:
                this.tilePosition.y--;
                break;
            case MonsterState.Left:
                this.tilePosition.x--;
                break;
            case MonsterState.Right:
                this.tilePosition.x++;
                break;
        }
        if (value != MonsterState.None) {
            this.movePosition = this.game.monsterGroundLayer.getPositionAt(this.tilePosition);
            let aniName = CommonHelper.getEnumName(MonsterState, value);
            if (!this.animation.getAnimationState(aniName).isPlaying) {
                this.animation.play(aniName);
            }
            this.currentAction = this.node.runAction(this.moveAction());
        }
    }

    update(dt: number) {
        if (this.MoveState == MonsterState.None) {
            this.MoveState = this.calculateNextStep(this.tilePosition);
        }
    }

    start() {
        this.game = Session.currentGameInstance();
        this.animation = this.node.getComponent(cc.Animation);
        this.tilePosition = TileHelper.getTilePos(this.node.position);
        this.preTile = CommonHelper.shallowCopy(cc.Vec2, this.tilePosition);
    }

    moveAction(): cc.Action {
        let move = cc.moveTo(this.duration, cc.p(this.movePosition.x, this.movePosition.y));
        let callback = cc.callFunc(() => {
            this.moveState = MonsterState.None;
        })
        return cc.sequence(move, callback);
    }

    calculateNextStep(tile: cc.Vec2): MonsterState {
        let endTile = this.game.MonsterEnd;
        if (tile.x < endTile.x && this.isValidPath(cc.p(tile.x + 1, tile.y)))
            return MonsterState.Right;
        else if (tile.x > endTile.x && this.isValidPath(cc.p(tile.x - 1, tile.y)))
            return MonsterState.Left;
        else if (tile.y > endTile.y && this.isValidPath(cc.p(tile.x, tile.y - 1)))
            return MonsterState.Back;
        else if (tile.y < endTile.y && this.isValidPath(cc.p(tile.x, tile.y + 1)))
            return MonsterState.Front;
        else if (tile.x == endTile.x && tile.y == endTile.y)
            return MonsterState.None;
        else if (this.isValidPath(cc.p(tile.x + 1, tile.y)))
            return MonsterState.Right;
        else if (this.isValidPath(cc.p(tile.x - 1, tile.y)))
            return MonsterState.Left;
        else if (this.isValidPath(cc.p(tile.x, tile.y - 1)))
            return MonsterState.Back;
        else if (this.isValidPath(cc.p(tile.x, tile.y + 1)))
            return MonsterState.Front;
    }

    isValidPath(tile: cc.Vec2): boolean {
        let type = TileHelper.getTileType(this.game.monsterGroundLayer, tile);
        return type == TileHelper.MonsterTileType && !this.preTile.equals(tile);
    }
}
