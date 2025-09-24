
import * as equipTable from '../json/equip_table.json';

type equipTable = typeof equipTable
type equipData = typeof equipTable['test_weapon'];

export class EquipTable {
    /** 获取装备配置 */
    public static GetData(equipName:string): equipData {
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