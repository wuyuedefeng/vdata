import {Effect, effect} from './effect'
class ComputedRefImpl {
    // public dep: any;
    public effect: Effect;
    private dirty: boolean;
    private _value: any;
    constructor(public getter: () => any, public setter: ((nv: any) => void) | null) {
        this.getter = getter
        this.setter = setter

        this.dirty = true
        this._value = undefined
        this.effect = effect(() => {
            this._value = this.getter()
            Effect.trigger(this, 'value')
        }, {
            lazy: true,
            scheduler: () => {
                this.dirty = false
            }
        })
    }
    get value(): any {
        if (this.dirty) {
            this.effect.runner ? this.effect.runner() : this.effect.call()
            this.dirty = false
        }
        Effect.track(this, 'value')
        return this._value
    }
    set value(value: any) {
        if (this.setter) {
            this.setter(value)
        }
        Effect.trigger(this, 'value')
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