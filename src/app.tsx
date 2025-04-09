
import { MonacoEditor } from "./components/monaco-editor";
import { useMemo, useRef, useState } from "react";
import { transpile } from "./common/transpile";

// https://www.npmjs.com/package/jsconsole

const initValue = `import React, { useEffect } from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'

import confetti from 'https://cdn.skypack.dev/canvas-confetti'

function App() {
  useEffect(() => confetti(), [])

  return (
    <div className="container">
      <h1>JavaScript Sandbox</h1>
      <p>
        You can use NPM packages provided by {''}
        <a href="https://www.skypack.dev/">Skypack</a>.
      </p>
      <img src="https://javascriptsandbox.netlify.app/image.gif" />
    </div>
  )
}

render(
  <App />,
  document.getElementById('app')
)


function sum(a, b) {
  return a + b;
}
console.log('Hello World!')

console.log('sum result:', sum(24, 45))
`;

export function App() {

  const [editorValue, setEditorValue] = useState("");

  const onEditorValueChange = (str: string) => {
    setEditorValue(str);
    // chrome.runtime.sendMessage({ data: str, type: "string" }, () => {});
    // console.log("send message");
    // window.postMessage({
    //   message: transpile(str).iframeCode,
    //   source: "editor",
    // });
  };

  const doc = useMemo(() => {
    const { iframeCode } = transpile(editorValue);
    return `
<html>
  <head>
    <style>
      html, body {
        font-family: Menlo, Monaco, "Courier New", monospace;
        margin: 0;
        padding: 0;
        font-size: 14px;
        height: 100%;
      }
      body {
        display: flex;
        flex-direction: column;
      }
      #app, #console-result {
        flex: 1;
      }
      #console-result-header {
        font-family: system-ui;
        font-weight: 600;
        padding: 0 0 0 8px;
        background: #edf2fa;
        height: 30px;
        line-height: 30px;
        border-top: 0.5px solid #e1e3e1;
      }
      #console-result > .line {
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
    <div id="app"></div>

    <div id="console-result-header">Console</div>
    <div id="console-result"></div>
    <script type="text/javascript">
      window.onerror = (message, source, lineno, colno, error) => {
        const app = document.getElementById('console-result');
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
          const app = document.getElementById('console-result');

          if (params?.length) {
            const div = document.createElement("div");
            div.className = 'line'
            const els = params.map(i => {
              const span = document.createElement("span");

              if (typeof i === 'number') {
                span.className = 'number';
              }
              span.innerText = i;

              div.append(span);
              div.append(' ')
            });
            app.append(div);
          }
        }
      };
    </script>
    <script type="module">
      ${iframeCode}
    </script>
  </body>
</html>
`;
  }, [editorValue]);

  const iframe = useRef<HTMLIFrameElement>(null);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <span className="font-semibold text-lg">
          online-javascript-runner
        </span>
      </header>
      <section className="flex flex-1">
        <div className="flex-1 border-r border-gray-300">
          <MonacoEditor
            initValue={initValue}
            onValueChange={onEditorValueChange}
            language="javascript"
          ></MonacoEditor>
        </div>
        <div className="flex-1">
          <iframe
            ref={iframe}
            src="about:srcdoc"
            srcDoc={doc}
            className="w-full h-full"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
