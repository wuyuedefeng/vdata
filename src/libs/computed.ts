import {Effect, effect} from './effect'
class ComputedRefImpl {
    private _dirty: boolean = false;
    private _value: any;
    // public dep: any;
    public effect: Effect;
    // public readonly __v_isComputed = true
    // public readonly __v_isRef = true
    constructor(public getter: () => any, public setter: ((nv: any) => void) | null) {
        this.getter = getter
        this.setter = setter

        // this._value = undefined
        this.effect = effect(this.getter, {
            lazy: false,
            scheduler: () => {
                this._dirty = true
                Effect.trigger(this, 'value')
            }
        })
        this._value = this.effect.effFn()
    }
    get value(): any {
        if (this._dirty) {
            this._value = this.getter()
            this._dirty = false
        }
        Effect.track(this, 'value')
        return this._value
    }
    set value(value: any) {
        if (this.setter) {
            this.setter(value)
        }
        // Effect.trigger(this, 'value')
    }
    get __v_isComputed() {
        return true
    }
    get __v_isRef() {
        return true
    }
}

function computed(value: any) {
    let getter = null
    let setter = null
    if (typeof value === 'function') {
        getter = value
    } else if (typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'get')) {
        getter = (value as any)['get']
        setter = Object.prototype.hasOwnProperty.call(value, 'set') ? (value as any)['set'] : null
    }
    console.assert(!!getter, 'Warning: computed getter is null')
    return new ComputedRefImpl(getter, setter)
}

function isComputed(value: any): boolean {
    return  value?.__v_isComputed || false
}

export { computed, isComputed, ComputedRefImpl }