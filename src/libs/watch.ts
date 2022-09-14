import {effect, Effect} from './effect'
import { computed } from './computed'
function watch(source: () => any, cb: (nv: any, ov: any) => void, options: any = null): () => void {
    options = {immediate: false, deep: false, ...options}
    let cValue = computed(source)
    let beforeValue: any = null
    let currentValue: any = JSON.parse(JSON.stringify(cValue.value))

    if (options.immediate) {
        cb(currentValue, beforeValue)
    }
    const eff = effect(() => {
        let preCurrentValue = options.deep ? JSON.parse(JSON.stringify(currentValue)) : currentValue
        currentValue = options.deep ? JSON.parse(JSON.stringify(cValue.value)) : cValue.value
        if (options.deep) {
            if (JSON.stringify(preCurrentValue) !== JSON.stringify(currentValue)) {
                beforeValue = preCurrentValue
                cb(currentValue, beforeValue)
            }
        } else {
            if (preCurrentValue !== currentValue) {
                beforeValue = preCurrentValue
                cb(currentValue, beforeValue)
            }
        }
    })

    const stop = () => {
        Effect.cleanup(cValue)
        eff.cleanup()
    }
    return stop
}

export { watch }