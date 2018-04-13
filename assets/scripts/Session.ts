import Game from "./Game";
import { MonsterConfig } from "./Interface";
import Camera from "./Camera";
import PropBar from "./PropBar";
import Tooltip from "./Tooltip";
import ResRecord from "./ResRecord";
import CommonHelper from "./CommonHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Session extends cc.Component {

    private static game: Game = null;
    private static camera: Camera = null;
    private static monsterPrefabs: MonsterConfig[] = null;
    private static currentSelectedNode: cc.Node = null;
    private static propbar: PropBar = null;
    private static tooltip: Tooltip = null;
    private static resRecords: ResRecord<any>[] = [];

    private static readonly cameraNode: string = 'camera';
    private static readonly tileMapNode: string = 'game/map';
    private static readonly propbarNode: string = 'game/propbar';
    private static readonly gameNode: string = 'game';

    private static readonly monsterConfigFile: string = 'resources/configs/monsters.json';
    /**
     * 游戏事件触发
     */
    public static readonly EventType = {
        /**
         * 怪物配置文件加载完毕触发
         */
        MONSTER_PREPARED: 'onMonsterPrepared',
        /**
         * 主角移动触发
         */
        PLAYER_MOVED: 'onPlayerMoved'
    };

    public static set CurrentSelectedNode(value: cc.Node) {
        if (Session.currentSelectedNode) {
            Session.currentSelectedNode.active = false;
        }

        Session.currentSelectedNode = value;

        if (Session.currentSelectedNode) {
            Session.currentPropBarInstance().node.active = true;
            Session.currentSelectedNode.active = true;
        } else {
            Session.currentPropBarInstance().node.active = false;
        }
    }

    public static get CurrentSelectedNode(): cc.Node {
        return Session.currentSelectedNode;
    }

    onload() {
        cc.game.addPersistRootNode(this.node);
    }

    start() {
        Session.CurrentSelectedNode = null;
        if (Session.monsterPrefabs == null) {
            cc.loader.load(cc.url.raw(Session.monsterConfigFile), (err, result) => {
                if (err) throw err;
                Session.monsterPrefabs = result.prefabs;
                Session.currentGameInstance().node.emit(Session.EventType.MONSTER_PREPARED);
            })
        }
    }

    public static get MonsterPrefabs(): MonsterConfig[] {
        if (Session.monsterPrefabs) return Session.monsterPrefabs;
    }

    static currentPropBarInstance(): PropBar {
        if (Session.propbar) return Session.propbar;
        let node = cc.find(Session.propbarNode);
        Session.propbar = node.getComponent(PropBar);
        return Session.propbar ? Session.propbar : null;
    }

    static currentGameInstance(): Game {
        if (Session.game) return Session.game;
        let rootNode = cc.find(Session.tileMapNode);
        Session.game = rootNode.getComponent(Game);
        return Session.game ? Session.game : null;
    }

    static currentCameraInstance(): Camera {
        if (Session.camera) return Session.camera;
        let cameraNode = cc.find(Session.cameraNode);
        Session.camera = cameraNode.getComponent(Camera);
        return Session.camera ? Session.camera : null;
    }

    static generateTooltip(position: cc.Vec2, tips: string) {
        if (Session.tooltip && Session.tooltip.node && Session.tooltip.node.isValid) {
            Session.tooltip.node.destroy();
        }
        let tooltipNode = cc.instantiate(Session.currentGameInstance().tooltipPrefab);
        let canvas = cc.find(Session.gameNode);
        let tipPos = cc.p(position.x - canvas.x + 25, position.y - canvas.y + 50);
        tooltipNode.setPosition(tipPos);
        canvas.addChild(tooltipNode);
        Session.tooltip = tooltipNode.getComponent(Tooltip);
        Session.tooltip.LabelString = tips;
    }

    static loadRes(url: string, completeCallback: (error: Error, resource: any) => void, type?: typeof cc.Asset): void {
        let res = CommonHelper.arrayFind(Session.resRecords, (record) => record.name == url);
        if (res) {
            completeCallback(null, res.resource);
        } else {
            if (type) {
                cc.loader.loadRes(url, type, (error: Error, resource: any) => {
                    let resRecord = new ResRecord(url, resource);
                    Session.resRecords.push(resRecord);
                    completeCallback(error, resource);
                });
            } else {
                cc.loader.loadRes(url, (error: Error, resource: any) => {
                    let resRecord = new ResRecord(url, resource);
                    Session.resRecords.push(resRecord);
                    completeCallback(error, resource);
                });
            }
        }
    }

    static releaseRes(url: string, type?: Function): void {
        let res = CommonHelper.arrayFind(Session.resRecords, (record) => record.name == url);
        if (!res) return;
        Session.resRecords.splice(Session.resRecords.indexOf(res), 1);
        if (type) {
            cc.loader.releaseRes(url, type);
        } else {
            cc.loader.releaseRes(url);
        }
    }

}
