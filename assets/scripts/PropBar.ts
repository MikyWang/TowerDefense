const { ccclass, property } = cc._decorator;

@ccclass
export default class PropBar extends cc.Component {

    @property(cc.Node)
    avatarNode: cc.Node = null;
    @property(cc.Node)
    skillNode: cc.Node = null;
    @property(cc.Node)
    propNode: cc.Node = null;

}
