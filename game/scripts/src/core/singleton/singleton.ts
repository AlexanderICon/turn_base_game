export class Singleton {
  private static instance: Map<string, any> = new Map();

  private constructor() { }

  public static Get<V>(key: string, target: { new(...parmas: any[]): V }, ...params: any[]): V {
    if (!this.instance.has(key)) {
      this.instance.set(key, new target(...params));
    }
    return this.instance.get(key);
  }

  public static Has<T>(key: string): T | undefined {
    return this.instance.get(key) as T;
  }

  public static Clear(key: string) {
    return this.instance.delete(key);
  }
}