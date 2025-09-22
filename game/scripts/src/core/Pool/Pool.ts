// 客户端对象池

enum poolStatus {
  remove, // 删除
  normal, // 正常
}

export class PoolController<T> {
  private _pool: { status: poolStatus; cls: T }[] = [];
  private _target: { new(): T };
  private _instance: (t: { status: poolStatus; cls: T }) => void; // 初始化时调用
  private _release: (t: { status: poolStatus; cls: T }) => void; // 回收调用

  constructor(target: { new(): T }, inst: (t: { status: poolStatus; cls: T }) => void, release: (t: { status: poolStatus; cls: T }) => void) {
    this._target = target;
    this._instance = inst;
    this._release = release;
  }

  /**获取一个对象
   * 如果对象池里面存在对象 则返回对象池的对象
   * 如果对象池里面没有闲置对象 则新建一个对象
   */
  getObject(): { status: poolStatus; cls: T } {
    const p = this._pool.find((e) => e.status == poolStatus.remove) ?? {
      status: poolStatus.normal,
      cls: new this._target(),
    };

    p.status = poolStatus.normal;

    if (!this._pool.includes(p)) {
      this._pool.push(p);
    }
    this._instance(p);
    return p;
  }

  /**
   * 回收对象
   */
  releaseObject(object: { status: poolStatus; cls: T }) {
    object.status = poolStatus.remove;
    this._release(object);
  }

  releaseAll() {
    for (let index = 0; index < this._pool.length; index++) {
      const element = this._pool[index];
      this.releaseObject(element);
    }
  }

  getPool() {
    return this._pool;
  }
}