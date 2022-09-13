import { Effect } from './effect'
function ref(rawValue: any) {
    const v = {
        get value() {
            Effect.track(v, 'value')
            return rawValue
        },
        set value(nv: any) {
            rawValue = nv
            Effect.trigger(v, 'value')
        },
        get __v_isRef() {
            return true
        }
    }
    return v
}

function isRef(value: any): boolean {
    return  value?.__v_isRef || false
}

export { ref, isRef }