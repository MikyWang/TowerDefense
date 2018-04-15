import { TouchKeeper } from "./TouchKeeper";

export interface MonsterConfig {
    name: string;
    url: string;
}

export interface PropertyConfig {
    name: string;
    avata: string;
    skills: SkillConfig[];
    properties: PanelConfig;
}

export interface SkillConfig {
    name: string;
    url: string;
    desc: string;
}

export interface PanelConfig {
    HP: number;
    MP: number;
    attack: number;
    defense: number;
    magicAttack: number;
    magicDefense: number;
    desc: string;
}