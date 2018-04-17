import TouchListener from "./TouchListener";
import Session from "./Session";
import Skill from "./Skill";
import Attribute from "./Attribute";

const { ccclass, property } = cc._decorator;

@ccclass
export default class InfoPanel extends TouchListener {

    @property(cc.String)
    configUrl: string = 'resources/configs/';
    @property(cc.Node)
    nameNode: cc.Node = null;
    @property(cc.Node)
    selectedNode: cc.Node = null;
    @property(cc.Node)
    bodyNode: cc.Node = null;

    public skills: Skill[] = [];
    public attribute: Attribute = null;

    start() {
        this.selectedNode.active = false;
        this.addEventListening();

    }

    private loadProperties() {
        cc.loader.load(cc.url.raw(this.configUrl), (error, data) => {

        });
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

}
