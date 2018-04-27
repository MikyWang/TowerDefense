import Session from "./Session";
import InfoPanel from "./InfoPanel";
import { PropertyConfig, SkillConfig } from "./Interface";
import LabelControl from "./LabelControl";
import Attribute from "./Attribute";
import SkillControl from "./SkillControl";
import Skill from "./Skill";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PropBar extends cc.Component {

    @property(cc.Node)
    avatarNode: cc.Node = null;
    @property(cc.Node)
    skillNodes: cc.Node = null;
    @property(cc.Node)
    propNode: cc.Node = null;
    @property(cc.Prefab)
    skillPrefab: cc.Prefab = null;

    onEnable() {
        if (Session.CurrentSelectedNode) {
            let infoPanel = Session.CurrentSelectedNode.parent.getComponent(InfoPanel);
            this.loadAvata(infoPanel.avataUrl);
            this.cleanSkills();
            infoPanel.skills.forEach(skill => {
                this.loadSkill(skill);
            });
            this.loadProperties(infoPanel.attribute);
        }
    }

    cleanSkills() {
        this.skillNodes.children.forEach(skillNode => {
            skillNode.destroy();
        });
    }

    loadAvata(url: string) {
        Session.loadRes(url, (error, spriteFrame) => {
            if (error) throw error;
            this.avatarNode.getComponent(cc.Sprite).spriteFrame = (spriteFrame as cc.SpriteFrame);
        }, cc.SpriteFrame);
    }

    loadSkill(skill: Skill) {
        let skillNode = cc.instantiate(this.skillPrefab);
        let skillConfig = { name: skill.skillName, cnName: skill.skillCnName, url: skill.textureUrl } as SkillConfig;
        skillNode.getComponent(SkillControl).SkillConfig = skillConfig;
        this.skillNodes.addChild(skillNode);
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
