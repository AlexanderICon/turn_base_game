import * as characterAttribute from '../../json/character_attribute.json';
import * as attributeDefine from '../../json/character_attribute_define.json';

export declare type CharacterAttri = typeof characterAttribute['character_default'];

type AttriDefine = typeof attributeDefine

export declare type AttriKey = keyof AttriDefine
export class CharacterAttribute {
    /** 获取属性配置 */
    public static GetData(characterName: string): CharacterAttri {

        return characterAttribute[`${characterName}`];
    }

    public static GetDefine(){
        return attributeDefine
    }
}
