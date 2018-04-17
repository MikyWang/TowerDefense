import { Skilltype } from "./enum";

export default class Skill {

    skillName: string;
    skillType: Skilltype;
    baseDamage: number;
    extraDamageRatio: number;

    constructor(skillName: string, skillType: Skilltype, baseDamage: number, extraDamageRatio: number) {
        this.skillName = skillName;
        this.skillType = skillType;
        this.baseDamage = baseDamage;
        this.extraDamageRatio = extraDamageRatio;
    }

}