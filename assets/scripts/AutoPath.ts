export default class AutoPath {

    /**
     * min（父节点的G加上父节点到当前节点的距离，原来的G）
     */
    public G: number;
    /**
     * 当前点到终点的距离
     */
    public H: number;

    /**
     * G+H
     */
    public get F(): number {
        return this.G + this.H;
    }

    public parentNode: AutoPath = null;

    public tilePosition: cc.Vec2 = null;

}