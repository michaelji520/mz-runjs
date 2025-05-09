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
          <Menubar className="border-none shadow-none ml-4">
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  New Window <MenubarShortcut>⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem disabled>New Incognito Window</MenubarItem>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger>Share</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>Email link</MenubarItem>
                    <MenubarItem>Messages</MenubarItem>
                    <MenubarItem>Notes</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <MenubarItem>
                  Print... <MenubarShortcut>⌘P</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger>Find</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>Search the web</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>Find...</MenubarItem>
                    <MenubarItem>Find Next</MenubarItem>
                    <MenubarItem>Find Previous</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <MenubarItem>Cut</MenubarItem>
                <MenubarItem>Copy</MenubarItem>
                <MenubarItem>Paste</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
              <MenubarContent>
                <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
                <MenubarCheckboxItem checked>
                  Always Show Full URLs
                </MenubarCheckboxItem>
                <MenubarSeparator />
                <MenubarItem inset>
                  Reload <MenubarShortcut>⌘R</MenubarShortcut>
                </MenubarItem>
                <MenubarItem disabled inset>
                  Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem inset>Toggle Fullscreen</MenubarItem>
                <MenubarSeparator />
                <MenubarItem inset>Hide Sidebar</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Profiles</MenubarTrigger>
              <MenubarContent>
                <MenubarRadioGroup value="benoit">
                  <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
                  <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
                  <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
                </MenubarRadioGroup>
                <MenubarSeparator />
                <MenubarItem inset>Edit...</MenubarItem>
                <MenubarSeparator />
                <MenubarItem inset>Add Profile...</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
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
