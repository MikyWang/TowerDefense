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
    animationUrl: string;
    spritesUrl: string;
}

export interface SkillConfig {
    name: string;
    cnName: string;
    url: string;
}

export interface BuildingConfig {
    name: string;
    price: number;
    spriteUrl: string;
    configUrl: string;
}

