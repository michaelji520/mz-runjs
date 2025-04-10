
import { MonacoEditor } from "./components/monaco-editor";
import { useMemo, useRef, useState } from "react";
import { transpile } from "./common/transpile";
import { defaultEditorValue, getIframeSrcDoc } from "./common/constant";

// https://www.npmjs.com/package/jsconsole

const initValue = defaultEditorValue;

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
    return getIframeSrcDoc(iframeCode);
  }, [editorValue]);

  const iframe = useRef<HTMLIFrameElement>(null);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <span className="font-semibold text-lg">
          Online JavaScript Runner
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
