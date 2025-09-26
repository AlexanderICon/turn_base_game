import * as marketItem from '../json/market_item.json';
import * as marketLevel from '../json/market_level_resource.json';

type dataType = typeof marketItem
type levelType = typeof marketLevel

export class MarketConfig {
    /** 获取难度配置 */
    public static GetItemData(dataKey:string) {
        const key = dataKey as keyof dataType
        return marketItem[key];
    }
    public static GetItemIcon(dataKey:string) {
        const dt = this.GetItemData(dataKey)
        if(dt){
            return dt.icon;
        }else
            return ''
       
    }



    public static GetLevelData(dataKey:string) {
        const key = dataKey as keyof levelType
        return marketLevel[key];
    }
}
