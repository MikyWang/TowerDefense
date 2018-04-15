import Session from "./Session";
import InfoPanel from "./InfoPanel";
import { PropertyConfig, SkillConfig, PanelConfig } from "./Interface";
import LabelControl from "./LabelControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PropBar extends cc.Component {

    @property(cc.Node)
    avatarNode: cc.Node = null;
    @property(cc.Node)
    skillNode: cc.Node = null;
    @property(cc.Node)
    propNode: cc.Node = null;

    onEnable() {
        if (Session.CurrentSelectedNode) {
            let infoPanel = Session.CurrentSelectedNode.parent.getComponent(InfoPanel);
            cc.loader.load(cc.url.raw(infoPanel.configUrl), (error, data) => {
                if (error) throw error;
                this.loadAvata((data as PropertyConfig).avata);
                let skillconfigs = (data as PropertyConfig).skills;
                skillconfigs.forEach(skillConfig => {
                    this.loadSkill(skillConfig);
                });
                let properties = (data as PropertyConfig).properties;
                this.loadProperties(properties);
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

    }

    loadProperties(properties: PanelConfig) {
        this.propNode.children.forEach(node => {
            let labelControl = node.getComponent(LabelControl);
            if (labelControl) {
                for (let prop in properties) {
                    if (labelControl.propName == prop) {
                        labelControl.detail = properties[prop];
                    }
                }
            }
        });
    }

}
