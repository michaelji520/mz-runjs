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
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "./components/mode-toggle";


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
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex h-screen flex-col overflow-hidden font-sans">
        {embed ? null : (
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 justify-between">
            <div className="font-semibold text-lg">
              Online JavaScript Runner
            </div>
            <div>
              <ModeToggle />

            </div>
            {/* <Separator orientation="vertical" className="mx-4" /> */}
            {/* <Menubar className="border-none shadow-none ml-4">
            <MenubarMenu>
              <MenubarTrigger>Files</MenubarTrigger>
              <MenubarContent>
                <MenubarCheckboxItem>
                  Share Code
                </MenubarCheckboxItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
              <MenubarContent>
                <MenubarCheckboxItem checked>Show Console</MenubarCheckboxItem>
                <MenubarCheckboxItem checked>
                  Show Webview
                </MenubarCheckboxItem>
                <MenubarCheckboxItem checked>
                  Show Style
                </MenubarCheckboxItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar> */}
          </header>

        )}
        <section className="flex flex-1 w-full" >
          <ResizablePanelGroup
            direction="horizontal"
          >
            <ResizablePanel defaultSize={50}>
              <div className="flex flex-col justify-center h-full">
                <div className="pl-2 bg-[#edf2fa] h-7 leading-7 font-semibold">JavaScript</div>
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

    </ThemeProvider>
  );
}
