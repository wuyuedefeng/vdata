import './style.css'
import typescriptLogo from './typescript.svg'
import { effect, reactive, ref } from './libs'

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
    count: 1
})
const count2 = ref(1)
const element: HTMLButtonElement = document.querySelector<HTMLButtonElement>('#counter')!;
element.addEventListener('click', () => {
    state.count += 1
    count2.value += 2
})
effect(() => {
    element.innerHTML = `count is ${state.count}`;
})
effect(() => {
    document.querySelector<HTMLButtonElement>('#count1')!.innerHTML = `count is ${state.count}`
})
effect(() => {
    document.querySelector<HTMLButtonElement>('#count2')!.innerHTML = `count2 is ${count2.value}`
})
