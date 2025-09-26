import * as investConfig from '../json/investment.json';
import { utils } from '../utils/util';

type dataType = typeof investConfig

const arrayConfig = utils.kvToArray(investConfig)
arrayConfig.pop()

export class InvestConfig {
    /** 获取投资配置 */
    public static GetData(dataKey:string) {
        const key = dataKey as keyof dataType
        return investConfig[key];
    }
    public static GetArray() {
        return arrayConfig;
    }
}