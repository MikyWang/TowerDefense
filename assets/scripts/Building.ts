import { BuildingConfig } from "./Interface";
import Session from "./Session";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Building extends cc.Component {

    @property(cc.Node)
    nameNode: cc.Node = null;
    @property(cc.Node)
    avataNode: cc.Node = null;
    @property(cc.Node)
    priceNode: cc.Node = null;

    private configUrl: string = '';
    private isInit: boolean = false;

    public get IsInit(): boolean {
        return this.isInit;
    }

    init(buildingConfig: BuildingConfig) {
        this.nameNode.getComponent(cc.Label).string = buildingConfig.name;
        this.priceNode.getComponent(cc.Label).string = `$ ` + buildingConfig.price;
        this.configUrl = buildingConfig.configUrl;
        Session.loadRes(buildingConfig.spriteUrl, (error, spriteFrame) => {
            if (error) throw error;
            this.avataNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        }, cc.SpriteFrame);
        this.isInit = true;
    }

    onBtnClick() {
        Session.currentGameInstance().node.emit(Session.EventType.BUILDING_SELECTED, this.configUrl);
        Session.destroyBuildPanel();
    }

}
