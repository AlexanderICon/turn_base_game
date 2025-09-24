
import * as characterAttribute from '../json/character_attribute.json';
import * as attributeDefine from '../json/character_attribute_define.json'

type characterAttribute = typeof characterAttribute
declare type CharacterAttri = typeof characterAttribute['character_default'];

export class CharacterAttributeTable {
    /** 获取属性配置 */
    public static GetData(characterName:string) {
        const key = characterName as keyof characterAttribute
        return characterAttribute[key];
    }
    public static GetDefine(){
        return attributeDefine;
    }
}
