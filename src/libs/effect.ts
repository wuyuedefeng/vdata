const bucket = new WeakMap()
let activeEffect: null | Effect = null
class Effect {
    private readonly fn: () => void;
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
        let deps = depsMap.get(key)
        if (!deps) {
            deps = new Set()
            depsMap.set(key, deps)
        }
        deps.add(activeEffect)
    }
    static trigger(target: Object, key: any): void {
        const bucket = Effect.bucket
        const depsMap = bucket.get(target)
        if(!depsMap) {
            return
        }
        const effects: Effect[] = depsMap.get(key)
        effects && effects.forEach(effect => effect.call())
    }
    constructor(fn: () => void) {
        this.fn = fn
        {
            activeEffect = this
            this.call()
            activeEffect = null
        }
    }
    call() {
        // this.fn.call(this)
        this.fn()
    }
}


function effect(fn: () => void): Effect {
    return new Effect(fn)
}

export { effect, Effect }