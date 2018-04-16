import Session from "./Session";
import InfoPanel from "./InfoPanel";
import { PropertyConfig, SkillConfig } from "./Interface";
import LabelControl from "./LabelControl";
import Attribute from "./Attribute";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PropBar extends cc.Component {

    @property(cc.Node)
    avatarNode: cc.Node = null;
    @property(cc.Node)
    skillNode: cc.Node = null;
    @property(cc.Node)
    propNode: cc.Node = null;

    public static existAttribute: { [index: string]: Attribute } = {};
    public static existSkills: { [index: string]: { [index: string]: SkillConfig } } = {};

    onEnable() {
        if (Session.CurrentSelectedNode) {
            let infoPanel = Session.CurrentSelectedNode.parent.getComponent(InfoPanel);
            cc.loader.load(cc.url.raw(infoPanel.configUrl), (error, data) => {
                if (error) throw error;
                this.loadAvata((data as PropertyConfig).avata);
                let skillconfigs = (data as PropertyConfig).skills;
                skillconfigs.forEach(skillConfig => {
                    if (!PropBar.existSkills[data.name]) {
                        PropBar.existSkills[data.name] = {};
                    }
                    if (!PropBar.existSkills[data.name][skillConfig.name]) {
                        PropBar.existSkills[data.name][skillConfig.name] = skillConfig;
                        this.loadSkill(skillConfig);
                    }
                });
                if (!PropBar.existAttribute[data.name]) {
                    PropBar.existAttribute[data.name] = (data as PropertyConfig).properties;
                }
                this.loadProperties(PropBar.existAttribute[data.name]);
            });
        }
    }

    loadAvata(url: string) {
        Session.loadRes(url, (error, spriteFrame) => {
            if (error) throw error;
            this.avatarNode.getComponent(cc.Sprite).spriteFrame = (spriteFrame as cc.SpriteFrame);
        }, cc.SpriteFrame);
    }

    loadSkill(skillconfig: SkillConfig) {
        Session.loadRes(skillconfig.url, (error, prefab) => {
            if (error) throw error;
            let skillPrefab = cc.instantiate(prefab);
            this.skillNode.addChild(skillPrefab);
        })
    }

    loadProperties(properties: Attribute) {
        this.propNode.children.forEach(node => {
            let labelControl = node.getComponent(LabelControl);
            if (labelControl) {
                for (let prop in properties) {
                    if (labelControl.propName == prop) {
                        labelControl.LabelString = properties[prop];
                    }
                }
            }
        });
    }

}
