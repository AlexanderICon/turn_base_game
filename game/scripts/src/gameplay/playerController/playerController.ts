import { Singleton } from "../../core/singleton/singleton";

export namespace playerController {

    class controller {
        private _array: CDOTAPlayerController[] = []


        public get array(): CDOTAPlayerController[] {
            return this._array
        }
    }

    export const key = 'playerController'

    export const instance = Singleton.Get<controller>(key, controller)
}