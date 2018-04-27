import { Skilltype } from "./enum";

export default class Skill {

    skillName: string;
    skillCnName: string;
    skillType: Skilltype;
    baseDamage: number;
    extraDamageRatio: number;
    textureUrl: string;
    desc: string;

    constructor(skillName: string, skillCnName: string, skillType: Skilltype, baseDamage: number, extraDamageRatio: number, textureUrl: string) {
        this.skillName = skillName;
        this.skillType = skillType;
        this.baseDamage = baseDamage;
        this.extraDamageRatio = extraDamageRatio;
        this.textureUrl = textureUrl;
        this.skillCnName = skillCnName;
    }

}