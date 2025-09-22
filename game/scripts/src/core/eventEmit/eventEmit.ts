type EventMap = Record<string, any>;
type EventKey<T extends EventMap> = string & keyof T;
type EventReceiver<T> = (params: T) => void;

interface Emitter<T extends EventMap> {
    on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
    off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
    emit<K extends EventKey<T>>(eventName: K, params: T[K]): void;
    once<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
}

export class EventEmitter<T extends EventMap> implements Emitter<T> {
    private listeners: {
        [K in keyof T]?: Array<EventReceiver<T[K]>>;
    } = {};

    /**
     * 监听事件
     * @param eventName 事件名称
     * @param fn 事件处理函数
     */
    on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void {
        this.listeners[eventName] = (this.listeners[eventName] || []).concat(fn);
    }

    /**
     * 取消监听
     * @param eventName 事件名称
     * @param fn 要移除的事件处理函数
     */
    off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void {
        this.listeners[eventName] = (this.listeners[eventName] || []).filter(f => f !== fn);
    }

    /**
     * 触发事件
     * @param eventName 事件名称
     * @param params 事件参数
     */
    emit<K extends EventKey<T>>(eventName: K, params: T[K]): void {
        (this.listeners[eventName] || []).forEach(fn => fn(params));
    }

    /**
     * 一次性监听
     * @param eventName 事件名称
     * @param fn 事件处理函数
     */
    once<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void {
        const onceFn: EventReceiver<T[K]> = (params: T[K]) => {
            this.off(eventName, onceFn);
            fn(params);
        };
        this.on(eventName, onceFn);
    }

    /**
     * 清除所有事件监听
     */
    clear(): void {
        this.listeners = {};
    }
}