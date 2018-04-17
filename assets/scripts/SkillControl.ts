import { SkillConfig } from "./Interface";
import Session from "./Session";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SkillControl extends cc.Component {

    @property(cc.Node)
    skillNode: cc.Node = null;
    @property(cc.Node)
    nameNode: cc.Node = null;

    public set SkillConfig(skillconfig: SkillConfig) {
        Session.loadRes(skillconfig.url, (error, spriteFrame) => {
            if (error) throw error;
            this.skillNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        }, cc.SpriteFrame);
        this.nameNode.getComponent(cc.Label).string = skillconfig.name;
    }

}
