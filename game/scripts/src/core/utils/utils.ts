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
}
