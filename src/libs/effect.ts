const bucket = new WeakMap()
const effectStack: Effect[] = []
let activeEffect: undefined | Effect = undefined
// const isObject = (value: any) => typeof value === 'object'
class Effect {
    private readonly fn: () => any;
    private active: boolean; // 开关
    private deps: Set<Set<Effect>>;
    public options: any;
    public effFn: (() => void);
    static get bucket(): WeakMap<Object, any> {
        return bucket
    }
    static get activeEffect(): undefined | Effect {
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
            bucket.set(target, (depsMap = new Map()))
        }
        let dep: Set<Effect> = depsMap.get(key)
        if (!dep) {
            depsMap.set(key, (dep = new Set()))
        }
        if (!dep.has(activeEffect)) {
            dep.add(activeEffect)
            activeEffect.deps.add(dep)
            if (typeof activeEffect.options.onTrack === 'function') {
                activeEffect.options.onTrack({effect: activeEffect, target, key})
            }
        }

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
            effect.run()
        })
    }
    constructor(fn: () => any, options: any = null) {
        this.active = true
        this.deps = new Set()
        this.options = { lazy: false, scheduler: null, onTrack: null, onTrigger: null, onStop: null, ...options }
        this.fn = fn
        this.effFn = () => {
            this.cleanup()
            try {
                effectStack.push(this)
                activeEffect = this
                return this.fn()
            } finally {
                effectStack.pop()
                activeEffect = effectStack[effectStack.length - 1]
            }
            // this.effFn = null
        }
        if (!this.options.lazy) {
            this.effFn()
        }
    }
    run(): any {
        if (!this.active) {
            return this.options.scheduler ? undefined : this.fn()
        }
        if (typeof this.options.scheduler === 'function') {
            return this.options.scheduler(this)
        } else {
            // this.fn.call(this)
            return this.fn()
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
        if (this.deps.size) {
            this.deps.forEach(dep => {
                dep.delete(this)
            })
        }
        this.deps.clear()
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