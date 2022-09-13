const bucket = new WeakMap()
let activeEffect: null | Effect = null
class Effect {
    private fn: () => void;
    static get bucket(): WeakMap<Object, any> {
        return bucket
    }
    static get activeEffect(): null | Effect {
        return activeEffect
    }
    constructor(fn: () => void) {
        this.fn = fn
        {
            activeEffect = this
            this.call()
            activeEffect = null
        }
    }
    call() {
        this.fn.call(this)
    }
}


function effect(fn: () => void): Effect {
    return new Effect(fn)
}

export { effect, Effect }