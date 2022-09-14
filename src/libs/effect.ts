const bucket = new WeakMap()
let activeEffect: null | Effect = null
// const isObject = (value: any) => typeof value === 'object'
class Effect {
    private readonly raw: () => any;
    private active: boolean; // 开关
    private deps: Set<Effect>[];
    public options: any;
    public runner: (() => void) | null;
    static get bucket(): WeakMap<Object, any> {
        return bucket
    }
    static get activeEffect(): null | Effect {
        return activeEffect
    }
    static track(target: Object, key: any): void {
        const activeEffect = Effect.activeEffect
        const bucket = Effect.bucket
        if (!activeEffect) {
            return
        }
        let depsMap = bucket.get(target)
        if (!depsMap) {
            depsMap = new Map()
            bucket.set(target, depsMap)
        }
        let dep: Set<Effect> = depsMap.get(key)
        if (!dep) {
            dep = new Set()
            depsMap.set(key, dep)
        }
        if (typeof activeEffect.options.onTrack === 'function') {
            activeEffect.options.onTrack({effect: activeEffect, target, key})
        }
        dep.add(activeEffect)
        activeEffect.deps.push(dep)
    }
    static trigger(target: Object, key: any): void {
        const bucket = Effect.bucket
        const depsMap = bucket.get(target)
        if(!depsMap) {
            return
        }
        const dep: Set<Effect> = depsMap.get(key)
        dep && dep.forEach(effect => {
            if (typeof effect.options.onTrigger === 'function') {
                effect.options.onTrigger({effect, target, key})
            }
            effect.call()
        })
    }
    constructor(fn: () => any, options: any = null) {
        this.active = true
        this.deps = []
        this.options = { lazy: false, scheduler: null, onTrack: null, onTrigger: null, onStop: null, ...options }
        this.raw = fn
        this.runner = () => {
            activeEffect = this
            this.call()
            activeEffect = null
            this.runner = null
        }
        if (!this.options.lazy) {
            this.runner()
        }
    }
    call(): void {
        if (!this.active) {
            return
        }
        // this.fn.call(this)
        this.raw()
        if (typeof this.options.scheduler === 'function') {
            this.options.scheduler()
        }
    }
    stop(): void {
        if (this.active) {
            this.cleanup()
            this.active = false
            if (typeof this.options.onStop === 'function') {
                this.options.onStop()
            }
        }
    }
    private cleanup() {
        if (this.deps.length) {
            for (let i = 0; i < this.deps.length; i++) {
                this.deps[i].delete(this)
            }
            this.deps.length = 0
        }
    }
    protected get _isEffect() {
        return true
    }
}

function effect(fn: () => void, options: any = null): Effect {
    return new Effect(fn, options)
}

function isEffect(value: any): boolean {
    return value?._isEffect || false
}

export { effect, isEffect, Effect }