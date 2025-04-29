import { MonacoEditor } from "./components/monaco-editor";
import { useEffect, useMemo, useRef, useState } from "react";
import { transpile } from "./common/transpile";
import { defaultEditorValue, getIframeSrcDoc } from "./common/constant";

const initValue = defaultEditorValue;

const search = new URLSearchParams(window.location.search);
const embed = search.get("embed") === "1";

export function App() {

  const [editorValue, setEditorValue] = useState("");
  const [consoleValue, setConsoleValue] = useState<string[][]>([]);

  const doc = useMemo(() => {
    const { iframeCode } = transpile(editorValue);
    return getIframeSrcDoc(iframeCode);
  }, [editorValue]);

  const iframe = useRef<HTMLIFrameElement>(null);

  const bindListener = () => {
    window?.addEventListener('message', function (event) {
      console.log("Message received from the child: ", event.data); // Message received from child
      const {type = '', args= []} = event.data || {};

      if (type === 'console') {
        setConsoleValue((prev) => ([...prev, args]));

      }

    });

  }

  useEffect(() => {
    bindListener();

  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {embed ? null : (
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <span className="font-semibold text-lg">
            Online JavaScript Runner
          </span>
        </header>

      )}
      <section className="flex flex-1">
        <div className="flex-1 border-r border-gray-300">
          <MonacoEditor
            initValue={initValue}
            onValueChange={setEditorValue}
            language="javascript"
          ></MonacoEditor>
        </div>
        <div className="flex-1 flex flex-col">
          <iframe
            ref={iframe}
            src="about:srcdoc"
            srcDoc={doc}
            className="w-full flex-1"
          ></iframe>
          {/* Console */}
          <div className="w-full flex-1 text-sm">
            <div className="font-semibold pl-2 bg-[#edf2fa] h-8 leading-8 border-t border-solid border-gray-200">Console</div>
            <div>{consoleValue.map((i, idx) => (
              <div key={idx} className="border-b-[0.5px] border-solid border-[#d6e2fb] py-[3px] pl-2">{
                i.map((j, subidx) => {
                  if (typeof j === 'string') {
                    return <span key={subidx}>{j}&nbsp;</span>;
                  } else if (typeof j === 'number') {
                    return <span key={subidx} className="text-[#0842a0]">{j}</span>;
                  }
                })
              }</div>
            ))}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
