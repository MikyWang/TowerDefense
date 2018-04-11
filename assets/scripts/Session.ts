import Game from "./Game";
import { MonsterConfig } from "./Interface";
import Camera from "./Camera";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Session extends cc.Component {

    private static game: Game = null;
    private static camera: Camera = null;
    private static readonly gameNode = 'game/map';
    private static monsterPrefabs: MonsterConfig[] = null;
    private static currentSelectedNode: cc.Node = null;
    private static readonly cameraNode = 'camera';
    private static monsterConfigFile: string = 'resources/configs/monsters.json';
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
            Session.currentSelectedNode.active = true;
        }
    }

    public static get CurrentSelectedNode(): cc.Node {
        return Session.currentSelectedNode;
    }

    onload() {
        cc.game.addPersistRootNode(this.node);
    }

    start() {
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

    static currentGameInstance(): Game {
        if (Session.game) return Session.game;
        let rootNode = cc.find(Session.gameNode);
        Session.game = rootNode.getComponent(Game);
        return Session.game ? Session.game : null;
    }

    static currentCameraInstance(): Camera {
        if (Session.camera) return Session.camera;
        let cameraNode = cc.find(Session.cameraNode);
        Session.camera = cameraNode.getComponent(Camera);
        return Session.camera ? Session.camera : null;
    }

}
