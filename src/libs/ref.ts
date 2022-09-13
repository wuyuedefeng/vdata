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
        }
    }
    return v
}

export { ref }