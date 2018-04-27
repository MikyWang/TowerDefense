import TouchListener from "./TouchListener";
import Session from "./Session";
import Skill from "./Skill";
import Attribute from "./Attribute";
import { PropertyConfig } from "./Interface";
import BuildControl from "./BuildControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class InfoPanel extends TouchListener {

    @property(cc.Node)
    nameNode: cc.Node = null;
    @property(cc.Node)
    selectedNode: cc.Node = null;
    @property(cc.Node)
    bodyNode: cc.Node = null;

    public skills: Skill[] = [];
    public attribute: Attribute = null;
    public avataUrl: string;

    start() {
        this.selectedNode.active = false;
        this.addEventListening();
    }

    public loadProperties(url: string) {
        cc.loader.load(cc.url.raw(url), (error, data) => {
            if (error) throw error;
            this.avataUrl = (data as PropertyConfig).avata;
            (data as PropertyConfig).skills.forEach(skillConfig => {
                cc.loader.load(cc.url.raw(skillConfig.url), (err, skill) => {
                    this.skills.push(skill as Skill);
                });
            });
            this.attribute = (data as PropertyConfig).properties;
            this.nameNode.getComponent(cc.Label).string = (data as PropertyConfig).name;
        });
        this.addSkillHandler();
    }

    protected TouchStartHandler(event: cc.Event.EventTouch) {
        super.TouchStartHandler(event);
        event.stopPropagation();
    }

    protected TouchEndHandler(event: cc.Event.EventTouch) {
        super.TouchEndHandler(event);
        event.stopPropagation();
    }

    protected oneFingerHandler() {
        if (Session.CurrentSelectedNode === this.selectedNode) {
            Session.CurrentSelectedNode = null;
        } else {
            Session.CurrentSelectedNode = this.selectedNode;
        }
    }

    playAnimation(aniName) {
        let animation = this.bodyNode.getComponent(cc.Animation);
        if (!animation.getAnimationState(aniName).isPlaying) {
            animation.play(aniName);
        }
    }

    addSkillHandler() {
        this.node.on(Session.EventType.SKILL_BUILD, (event) => {
            if (Session.buildingControl) return;
            if (this.checkSkill(Session.EventType.SKILL_BUILD)) {
                Session.loadRes(Session.buildingScrollUrl, (error, prefab) => {
                    if (error) throw error;
                    let scrollNode = cc.instantiate(prefab) as cc.Node;
                    Session.buildingControl = scrollNode.getComponent(BuildControl);
                    let canvas = cc.find(Session.GameNode);
                    canvas.addChild(scrollNode);
                });
            }
        })
    }

    checkSkill(skillName: string): boolean {
        return this.skills.some(skill => skill.skillName == skillName);
    }
}
