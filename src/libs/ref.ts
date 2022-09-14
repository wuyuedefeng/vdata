import { Effect } from './effect'

class RefImpl {
    private _value: any;
    constructor(rawValue: any) {
        this._value = rawValue
    }
    get value() {
        Effect.track(this, 'value')
        return this._value
    }
    set value(nv: any) {
        this._value = nv
        Effect.trigger(this, 'value')
    }
    get __v_isRef() {
        return true
    }
}

function ref(rawValue: any): RefImpl {
    return new RefImpl(rawValue)
}

function isRef(value: any): boolean {
    return  value?.__v_isRef || false
}

export { ref, isRef }