import { Effect } from './effect'
function reactive(value: Object) {
    return new Proxy(value, {
        get(target, key, ...args) {
            Effect.track(target, key);
            return Reflect.get(target, key, ...args)
        },
        set(target, key, ...args) {
            Reflect.set(target, key, ...args)
            Effect.trigger(target, key)
            return true
        }
    })
}

export { reactive }