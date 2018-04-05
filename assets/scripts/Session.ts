import Game from "./Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Session extends cc.Component {

    private static game: Game = null;
    private static readonly gameNode = 'game/map';

    onload() {
        cc.game.addPersistRootNode(this.node);
    }

    static currentGameInstance(): Game {
        if (Session.game) return Session.game;
        let rootNode = cc.find(Session.gameNode);
        Session.game = rootNode.getComponent(Game);
        return Session.game ? Session.game : null;
    }

}
