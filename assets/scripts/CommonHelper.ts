import AutoPath from "./AutoPath";
import TileHelper from "./TileHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CommonHelper extends cc.Component {

    static shallowCopy<T>(type: { new(): T }, src: T): T {
        let dst = new type();
        if (dst instanceof Array && src instanceof Array) {
            for (const value of src) {
                dst.push(value);
            }
        } else {
            for (let prop in src) {
                if (src.hasOwnProperty(prop)) {
                    dst[prop] = src[prop];
                }
            }
        }
        return dst;
    }

    static arrayFind<T>(arr: Array<T>, callbackfn: (value: T, index: number, array: T[]) => any): T {
        let result = arr.filter(callbackfn);
        if (result.length == 0) return null;
        return result.pop();
    }

    static getEnumName<T>(type: any, eWord: T): string {
        return type[eWord].toString().toLowerCase();
    }

    /**
     * A*算法自动寻路
     * @param startTile 起始tile坐标
     * @param endTile 终点tile坐标
     * @param isValidPath 可通过tile条件
     */
    static AStartSearchPath(startTile: cc.Vec2, endTile: cc.Vec2, isValidPath: (tile) => boolean): cc.Vec2[] {
        let openPath: AutoPath[] = [];
        let closedPath: AutoPath[] = [];
        let result: cc.Vec2[] = [];
        let startPath = new AutoPath(CommonHelper.shallowCopy(cc.Vec2, startTile));
        openPath.push(startPath);
        let endPath = CommonHelper.searchMinPath(openPath, closedPath, endTile, isValidPath);
        while (endPath != null) {
            result.push(endPath.tilePosition);
            if (!endPath.parentNode) break;
            endPath = endPath.parentNode;
        }
        return result;
    }

    private static searchMinPath(openPath: AutoPath[], closedPath: AutoPath[], endTile: cc.Vec2, isValidPath: (tile) => boolean): AutoPath {
        let endPaths = openPath.filter(path => path.tilePosition.equals(endTile));
        if (endPaths.length == 1) {
            return endPaths.pop();
        }
        if (openPath.length == 0) return null;
        if (openPath.length > 1) {
            openPath.sort((a, b) => {
                return b.F - a.F;
            });
        }

        let minPath = openPath.pop();
        closedPath.push(minPath);
        let interfacingTiles = TileHelper.getInterfacingTile(minPath.tilePosition);
        interfacingTiles.forEach(tile => {
            if (isValidPath(tile) && !closedPath.some((path => path.tilePosition.equals(tile)))) {
                if (!openPath.some(path => path.tilePosition.equals(tile))) {
                    let path = new AutoPath(tile);
                    path.G = minPath.G + 1;
                    path.parentNode = minPath;
                    openPath.push(path);
                } else {
                    openPath.forEach(path => {
                        if (path.tilePosition.equals(tile)) {
                            let G = minPath.G + 1;
                            if (G < path.G) {
                                path.G = G;
                                path.parentNode = minPath;
                            }
                        }
                    });
                }
            }
        });
        return CommonHelper.searchMinPath(openPath, closedPath, endTile, isValidPath);
    }

    static getByteLength(value: string): number {
        let length = 0;
        for (let i = 0; i < value.length; i++) {
            if (value.charCodeAt(i) >= 0 && value.charCodeAt(i) <= 128) {
                length += 1;
            } else {
                length += 2;
            }
        }
        return length;
    }

}

