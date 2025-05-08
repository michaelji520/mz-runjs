
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
        <img style={{width: 280}} src="https://i.postimg.cc/V6xfY9DP/giphy.gif" />
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
      #${appDomId} {
        flex: 1;
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
        return true;
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