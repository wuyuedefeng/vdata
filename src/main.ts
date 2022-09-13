import './style.css'
import typescriptLogo from './typescript.svg'
import { effect, reactive } from './libs'

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
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

const state: any = reactive({
    count: 1
})
const element: HTMLButtonElement = document.querySelector<HTMLButtonElement>('#counter')!;
element.addEventListener('click', () => {
    state.count += 1;
})
effect(() => {
    element.innerHTML = `count is ${state.count}`;
})
