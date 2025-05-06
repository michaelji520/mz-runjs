
export const defaultEditorValue = `
import React, { useEffect } from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'

function App() {

  const [count, setCount] = React.useState(0);

  return (
    <div className="container">
      <h2>You can use React component!</h2>
      <p>
        NPM packages are provided by {' '}
        <a href="https://www.skypack.dev/">Skypack</a>.
      </p>
      <div>
        <img  style={{width: 280}} src="https://i.postimg.cc/V6xfY9DP/giphy.gif" />
      </div>
      <div>
        <button onClick={() => setCount(count + 1)}>Click me to increase</button>
      </div>
      <p>Count: {count}</p>
    </div>
  )
}
// You can place react component to container which dom id is 'app' 
render(<App />, document.getElementById('app'))


// Or you can simply run some javascript code, result will auto display in 'Console'
function sum(a, b) {
  return a + b;
}

console.log('sum result:', sum(24, 45))
`;

export const appDomId = 'app';
export const consoleDomId = 'ac03afce-cfde-483d-9494-a7219d54713b';
export const consoleResultHeaderId = 'a16b4cc4-da9d-4ad5-983c-f71345b3c875';

export const getIframeSrcDoc = (value: string) => {
  return `
<html>
  <head>
    <style>
      html, body {
        font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        margin: 0;
        padding: 0;
        font-size: 14px;
        height: 100%;
      }
      body {
        display: flex;
        flex-direction: column;
      }
      #${appDomId}, #${consoleDomId} {
        flex: 1;
      }
      #${consoleResultHeaderId} {
        font-family: system-ui;
        font-weight: 600;
        padding: 0 0 0 8px;
        background: #edf2fa;
        height: 30px;
        line-height: 30px;
        border-top: 0.5px solid #e1e3e1;
      }
      #${consoleDomId} > .line {
        border-bottom: 0.5px solid #d6e2fb;
        padding: 3px 0 3px 8px;
      }
      .number {
        color: #0842a0;
      }
      .error {
        color: #3b120e;
        background: #f9eceb;
      }
    </style>
  </head>
  <body>
    <div id="${appDomId}"></div>

    <script type="text/javascript">
      window.onerror = (message, source, lineno, colno, error) => {
        const app = document.getElementById('${appDomId}');
        const div = document.createElement("div");
        div.className = 'error';
        div.innerText = message;
        app.innerHTML = '';
        app.append(div);
        // here 'return true' will block error meesage from showing on devtool
        // return true;
      }
      const console = {
        log: (...params) => {
          if (params?.length) {
            window.parent.postMessage({type: 'console', args: params}, '*');
          }
        }
      };
    </script>
    <script type="module">
      ${value}
    </script>
  </body>
</html>
`;
}