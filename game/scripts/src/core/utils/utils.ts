export class utils {
    /**
     * KV 对象转数组，并保留 key 名称
     * @param kv - 形如 { "UnitA": {...}, "UnitB": {...} }
     * @returns 数组 [{ name: "UnitA", ...}, { name: "UnitB", ...}]
     */
    static kvToArray<T extends object>(kv: Record<string, T>): (T & { id: string })[] {
        return Object.entries(kv).map(([id, value]) => ({
            id,
            ...value,
        }));
    }

    /**
     * 按照权重随机返回一个配置项
     */
    static getRandomByWeight<T extends { weight: number }>(items: T[]): T {
        const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
        const rand = RandomFloat(0, 1) * totalWeight;

        let cumulative = 0;
        for (const item of items) {
            cumulative += item.weight;
            if (rand < cumulative) {
                return item;
            }
        }

        // 理论上不会到这里
        return items[items.length - 1];
    }
}

export type weightCfg = {
    weight: number;
};
