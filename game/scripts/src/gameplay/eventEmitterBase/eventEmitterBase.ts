import { EventEmitter } from '../../core/eventEmit/eventEmit';

export class eventEmitterBase<T> {
    private event: EventEmitter<T>;

    constructor() {
        this.event = new EventEmitter();
    }

    public get emitter(): EventEmitter<T> {
        return this.event;
    }
}
