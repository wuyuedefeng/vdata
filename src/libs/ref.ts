import { Effect } from './effect'

class RefImpl {
    private _value: any;
    // public readonly __v_isRef = true
    constructor(rawValue: any, _shallow: boolean = false) {
        this._value = rawValue
    }
    get value() {
        Effect.track(this, 'value')
        return this._value
    }
    set value(nv: any) {
        // TODO: if (!hasChanged(nv, this._value)) return;
        this._value = nv
        Effect.trigger(this, 'value')
    }
    get __v_isRef() {
        return true
    }
}

function ref(rawValue: any): RefImpl {
    return isRef(rawValue) ? rawValue : new RefImpl(rawValue)
}

function isRef(value: any): boolean {
    return  value?.__v_isRef || false
}

export { ref, isRef }