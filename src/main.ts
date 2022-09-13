import './style.css'
import typescriptLogo from './typescript.svg'
import { effect, reactive, isReactive, ref, isRef, computed, isComputed } from './libs'

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
      <button id="counter" type="button">button</button>
    </div>
    <p class="read-the-docs">
      <div id="count1"></div>
      <div id="count2"></div>
      <div id="count3"></div>
    </p>
  </div>
`

const state: any = reactive({
    count: 0,
    info: {
        count: 0
    }
})
const doubleInfoCount = computed(() => state.info.count * 2);
console.log(`isComputed: ${isComputed(doubleInfoCount)}`)
console.log(`isReactive: ${isReactive(state)}`)
const refData = ref(0)
console.log(`isRef: ${isRef(refData)}`)
const element: HTMLButtonElement = document.querySelector<HTMLButtonElement>('#counter')!;
element.addEventListener('click', () => {
    state.count += 1
    state.info.count = state.count * 2
    refData.value = state.count * 3
})
effect(() => {
    element.innerHTML = `count is ${state.count}`;
    document.querySelector<HTMLDivElement>('#count1')!.innerHTML = `reactive info.count(x2): ${state.info.count}`
    document.querySelector<HTMLDivElement>('#count2')!.innerHTML = `refData(x3): ${refData.value}`
    document.querySelector<HTMLDivElement>('#count3')!.innerHTML = `computed double info.count: ${doubleInfoCount.value}`
    // console.log(111)
})
