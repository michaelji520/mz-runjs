import { MonacoEditor } from "./components/monaco-editor";
import { useEffect, useMemo, useRef, useState } from "react";
import { transpile } from "./common/transpile";
import { defaultEditorValue, getIframeSrcDoc } from "./common/constant";
import { ConsoleOutput } from "./components/console-output";
import clsx from "clsx";
import { WebviewWrapper } from "./components/webview-wrapper";
import { Separator } from "@/components/ui/separator"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

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


  const onConsoleUpdate = (event: MessageEvent<any>) => {
    // Message received from child
    console.log("Message received from the child: ", event.data);
    const { type = '', args = [] } = event.data || {};

    if (type === 'console') {
      setConsoleValue((prev) => ([...prev, args]));
    }
  }

  useEffect(() => {
    window.addEventListener('message', onConsoleUpdate, false);
    return () => {
      window.removeEventListener('message', onConsoleUpdate, false);
    }
  }, []);

  useEffect(() => {
    setConsoleValue([]);
  }, [doc])

  return (
    <div className="flex h-screen flex-col overflow-hidden font-sans">
      {embed ? null : (
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <span className="font-semibold text-lg">
            Online JavaScript Runner
          </span>
          {/* <Separator orientation="vertical" className="mx-4" /> */}
        </header>

      )}
      <section className="flex flex-1 w-full" >
        <ResizablePanelGroup
          direction="horizontal"
        >
          <ResizablePanel defaultSize={50}>
            <div className="flex items-center justify-center h-full">
              <MonacoEditor
                initValue={initValue}
                onValueChange={setEditorValue}
                language="javascript"
              ></MonacoEditor>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={50}>
                <div className="flex h-full justify-center">
                  <WebviewWrapper doc={doc} />
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={50}>
                <div className="flex h-full justify-center">
                  <ConsoleOutput consoleValue={consoleValue} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </section>
    </div>
  );
}
