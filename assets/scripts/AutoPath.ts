import Session from "./Session";

export default class AutoPath {

    /**
     * min（父节点的G加上父节点到当前节点的距离，原来的G）
     */
    public G: number = 0;
    /**
     * 当前点到终点的距离
     */
    public readonly H: number;

    /**
     * G+H
     */
    public get F(): number {
        return this.G + this.H;
    }

    public parentNode: AutoPath = null;

    public tilePosition: cc.Vec2 = null;

    constructor(tilePosition: cc.Vec2) {
        this.tilePosition = tilePosition;
        let monsterEnd = Session.currentGameInstance().MonsterEnd;
        this.H = Math.abs(monsterEnd.x - tilePosition.x) + Math.abs(monsterEnd.y - tilePosition.y);
    }



}