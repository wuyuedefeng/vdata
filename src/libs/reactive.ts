import { Effect } from './effect'
const isObject = (value: any) => typeof value === 'object'
function reactive<T extends object>(value: T): T {
    return new Proxy(value, {
        get(target, key, ...args) {
            if (key === '__v_isReactive') {
                return true
            }
            Effect.track(target, key);
            const value = Reflect.get(target, key, ...args)
            return isObject(value) ? reactive(value) : value
        },
        set(target, key, value, ...args) {
            const oldValue = Reflect.get(target, key, ...args)
            const isValueChange = oldValue !== value
            // const isNewAttr = !Object.prototype.hasOwnProperty.call(target, key)
            if (isValueChange) {
                Reflect.set(target, key, value, ...args)
                Effect.trigger(target, key)
            }
            return isValueChange
        }
    })
}

function isReactive(value: any): boolean {
    return  value?.__v_isReactive || false
}

export { reactive, isReactive }