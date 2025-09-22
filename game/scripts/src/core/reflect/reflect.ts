export class ReflectController {
  private static pool: Map<string, any> = new Map();
  private static group: ReflectBase[] = [];
  private static keyToValue: { [o: string]: any } = {};

  static ClassDecoreatoers<T extends ReflectBase>(data: T) {
    return function ClassDecoreatoers(target: any) {
      ReflectController.pool.set(data.key, target);
      ReflectController.pool.set(`${data.key}group`, data);
      ReflectController.group.push(data);
    };
  }

  static ParamsDecoreatoers<T>(key: string, tag: T) {
    return function ParamsDecoreatoers(target: any) {
      ReflectController.keyToValue[key] = tag;
    };
  }

  static ParamsAddKeyValue<T>(key: string, tag: T) {
    ReflectController.keyToValue[key] = tag;
  }

  static GetClass<T>(key: string, ...params: any[]) {
    const t = ReflectController.pool.get(key);
    return t ? (new t(...params) as T) : void 0;
  }

  static GetBaseParamData<T extends ReflectBase>(key: string) {
    return ReflectController.pool.get(`${key}group`) as T | undefined;
  }

  static GetAllFilters<T extends ReflectBase>(condition: (e: T) => unknown) {
    return ReflectController.group.filter((e) => condition(e as T)) as T[];
  }

  static getParamsByKey<T>(key: string): T | undefined {
    return ReflectController.keyToValue[key];
  }
}
