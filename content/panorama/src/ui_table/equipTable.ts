
import * as equipTable from '../json/equip_table.json';

type equipTable = typeof equipTable
declare type CharacterAttri = typeof equipTable['test_weapon'];

export class EquipTable {
    /** 获取装备配置 */
    public static GetData(equipName:string): CharacterAttri {
        const key = equipName as keyof equipTable
        return equipTable[key];
    }
    public static GetIcon(equipName:string){
        const data = this.GetData(equipName);
        if(data){
            return data.icon;
        }else{
            return ''
        }
    }
}