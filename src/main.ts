import './style.css'
import typescriptLogo from './typescript.svg'
import { effect, reactive, isReactive, ref, isRef } from './libs'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      <span id="count1"></span>
      <span id="count2"></span>
    </p>
  </div>
`

const state: any = reactive({
    count: 0,
    info: {
        count: 0
    }
})
console.log(`isReactive: ${isReactive(state)}`)
const refData = ref(0)
console.log(`isRef: ${isRef(refData)}`)
const element: HTMLButtonElement = document.querySelector<HTMLButtonElement>('#counter')!;
element.addEventListener('click', () => {
    state.count += 1
    state.info.count += 2
    refData.value += 3
})
effect(() => {
    element.innerHTML = `count is ${state.count}`;
    document.querySelector<HTMLButtonElement>('#count1')!.innerHTML = `info.count: ${state.info.count}`
    document.querySelector<HTMLButtonElement>('#count2')!.innerHTML = `count2 is ${refData.value}`
    // console.log(111)
})
