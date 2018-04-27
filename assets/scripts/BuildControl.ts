import Session from "./Session";
import { BuildingConfig } from "./Interface";
import Building from "./Building";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuildControl extends cc.Component {

    @property(cc.Node)
    buildContainerNode: cc.Node = null;

    private static readonly buildingPrefabUrl: string = '/prefabs/building';

    start() {
        this.initValidBuildings();
    }

    initValidBuildings() {
        cc.loader.load(cc.url.raw(Session.buildingConfigFile), (error, data) => {
            let buildings = data.buildings as BuildingConfig[];
            buildings.forEach(building => {
                this.addBuilding(building);
            });
        });
    }

    addBuilding(buildingConfig: BuildingConfig) {
        Session.loadRes(BuildControl.buildingPrefabUrl, (error, prefab) => {
            if (error) throw error;
            let buildingNode = cc.instantiate(prefab) as cc.Node;
            buildingNode.getComponent(Building).init(buildingConfig);
            this.buildContainerNode.addChild(buildingNode);
        });
    }


}
