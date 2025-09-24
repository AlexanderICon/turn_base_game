import { Singleton } from '../../core/singleton/singleton';
import { eventEmitterBase } from '../eventEmitterBase/eventEmitterBase';
import { cfgDifficulty, cfgGlobal } from '../global/global';

type typeCfgDifficulty = {
    difficulty: number;
    maxRound: number;
};

interface emitter {}

export namespace difficultyController {
    export class controller extends eventEmitterBase<emitter> {
        private _difficulty: number;
        private _cfg: typeCfgDifficulty;

        public get current(): number {
            return this._difficulty;
        }

        public set current(v: number) {
            if (this._difficulty > 0) return;

            this._difficulty = v;
            this._cfg = this.getDifficultyConfig(v);
        }

        public get max(): number {
            return this._cfg ? this._cfg.maxRound : cfgGlobal.defaultMaxRound;
        }

        private getDifficultyConfig(current?: number): typeCfgDifficulty {
            return (
                cfgDifficulty[(current ? current : this._difficulty).toString()] ?? {
                    difficulty: cfgGlobal.defaultDifficulty,
                    maxRound: cfgGlobal.defaultMaxRound,
                }
            );
        }

        constructor() {
            super();
            this._difficulty = -1;
        }
    }

    export function instance() {
        return Singleton.Get<controller>('difficultyController', controller);
    }
}
