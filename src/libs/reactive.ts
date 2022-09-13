import { Effect } from './effect'
function reactive(value: Object) {
    return new Proxy(value, {
        get(target, key, ...args) {
            track(target, key);
            return Reflect.get(target, key, ...args)
        },
        set(target, key, ...args) {
            Reflect.set(target, key, ...args)
            trigger(target, key)
            return true
        }
    })
}

function track(target: Object, key: any) {
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

function trigger(target: Object, key: any) {
    const bucket = Effect.bucket
    const depsMap = bucket.get(target)
    if(!depsMap) {
        return
    }
    const effects: Effect[] = depsMap.get(key)
    effects && effects.forEach(effect => effect.call())
}


export { reactive }