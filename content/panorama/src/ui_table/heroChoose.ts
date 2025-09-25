import * as heroChooseCfg from '../json/heroControllerList.json';

type dataType = typeof heroChooseCfg

export class HeroChooseConfig {
    /** 获取难度配置 */
    public static GetData(dataKey:string) {
        const key = dataKey as keyof dataType
        return heroChooseCfg[key];
    }
}
