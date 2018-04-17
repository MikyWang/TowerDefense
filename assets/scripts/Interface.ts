import Attribute from "./Attribute";
import { Skilltype } from "./enum";

export interface MonsterConfig {
    name: string;
    url: string;
}

export interface PropertyConfig {
    name: string;
    avata: string;
    skills: SkillConfig[];
    properties: Attribute;
}

export interface SkillConfig {
    name: string;
    url: string;
    desc: string;
    baseDamage: number,
    extraDamageRatio: number,
    type: Skilltype;
}

