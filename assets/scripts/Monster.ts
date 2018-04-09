import CommonHelper, { MonsterState } from "./CommonHelper";
import Session from "./Session";
import Game from "./Game";
import TileHelper from "./TileHelper";
import AutoPath from "./AutoPath";

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
    private openPath: AutoPath[] = [];
    private closedPath: AutoPath[] = [];
    private minPath: AutoPath[] = [];

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
        if (this.MoveState == MonsterState.None && this.minPath.length > 0) {
            this.MoveState = this.calculateNextStep(this.minPath.pop().tilePosition);
        }
    }

    start() {
        this.game = Session.currentGameInstance();
        this.animation = this.node.getComponent(cc.Animation);
        this.tilePosition = TileHelper.getTilePos(this.node.position);
        this.openPath = [];
        this.closedPath = [];
        this.minPath = [];
        let startPath = new AutoPath(CommonHelper.shallowCopy(cc.Vec2, this.tilePosition));
        this.openPath.push(startPath);
        let endPath = this.searchMinPath();
        while (true) {
            this.minPath.push(endPath);
            if (!endPath.parentNode) break;
            endPath = endPath.parentNode;
        }
    }

    searchMinPath(): AutoPath {

        let endPaths = this.openPath.filter(path => path.tilePosition.equals(this.game.MonsterEnd));

        if (endPaths.length == 1) {
            return endPaths.pop();
        }
        if (this.openPath.length > 1) {
            this.openPath.sort((a, b) => {
                return b.F - a.F;
            });
        }
        let minPath = this.openPath.pop();

        this.closedPath.push(minPath);
        let interfacingTiles = TileHelper.getInterfacingTile(minPath.tilePosition);
        interfacingTiles.forEach(tile => {
            if (TileHelper.getTileType(this.game.backGroundLayer, tile) == TileHelper.MonsterTileType
                && this.closedPath.filter(path => path.tilePosition.equals(tile)).length == 0) {
                let existPaths = this.openPath.filter(path => path.tilePosition.equals(tile));
                if (existPaths.length == 0) {
                    let path = new AutoPath(tile);
                    path.G = minPath.G + 1;
                    path.parentNode = minPath;
                    this.openPath.push(path);
                }
            }
        });
        this.openPath.forEach(path => {
            let G = minPath.G + 1;
            if (G < path.G) {
                path.G = G;
                path.parentNode = minPath;
            }
        });

        return this.searchMinPath();
    }

    moveAction(): cc.Action {
        let move = cc.moveTo(this.duration, cc.p(this.movePosition.x, this.movePosition.y));
        let callback = cc.callFunc(() => {
            this.moveState = MonsterState.None;
        })
        return cc.sequence(move, callback);
    }

    calculateNextStep(tile: cc.Vec2): MonsterState {
        // let endTile = this.game.MonsterEnd;
        // if (tile.x < endTile.x && this.isValidPath(cc.p(tile.x + 1, tile.y)))
        //     return MonsterState.Right;
        // else if (tile.x > endTile.x && this.isValidPath(cc.p(tile.x - 1, tile.y)))
        //     return MonsterState.Left;
        // else if (tile.y > endTile.y && this.isValidPath(cc.p(tile.x, tile.y - 1)))
        //     return MonsterState.Back;
        // else if (tile.y < endTile.y && this.isValidPath(cc.p(tile.x, tile.y + 1)))
        //     return MonsterState.Front;
        // else if (tile.x == endTile.x && tile.y == endTile.y)
        //     return MonsterState.None;
        // else if (this.isValidPath(cc.p(tile.x + 1, tile.y)))
        //     return MonsterState.Right;
        // else if (this.isValidPath(cc.p(tile.x - 1, tile.y)))
        //     return MonsterState.Left;
        // else if (this.isValidPath(cc.p(tile.x, tile.y - 1)))
        //     return MonsterState.Back;
        // else if (this.isValidPath(cc.p(tile.x, tile.y + 1)))
        //     return MonsterState.Front;
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
