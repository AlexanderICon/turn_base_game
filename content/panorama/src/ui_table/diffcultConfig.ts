import * as difficultConfig from '../json/difficulty.json';

type equipTable = typeof difficultConfig

export class DifficultConfig {
    /** 获取难度配置 */
    public static GetData(equipName:string) {
        const key = equipName as keyof equipTable
        return difficultConfig[key];
    }
}
