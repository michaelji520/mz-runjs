import { MonacoEditor } from "./components/monaco-editor";
import { useEffect, useMemo, useRef, useState } from "react";
import { transpile } from "./common/transpile";
import { defaultEditorValue, getIframeSrcDoc } from "./common/constant";
import { ConsoleOutput } from "./components/console-output";
import clsx from "clsx";
import { WebviewWrapper } from "./components/webview-wrapper";

const initValue = defaultEditorValue;

const search = new URLSearchParams(window.location.search);
const embed = search.get("embed") === "1";
const minLeftWidth = 10;
const minRightWidth = 10;
const initialLeftWidth = 50; // Initial width of the left pane (in percentage)

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
    document.title = "Online JavaScript Runner";
    window.addEventListener('message', onConsoleUpdate, false);
    return () => {
      window.removeEventListener('message', onConsoleUpdate, false);
    }
  }, []);

  useEffect(() => {
    setConsoleValue([]);
  }, [doc])

  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const splitPaneRef = useRef<HTMLDivElement>(null);
  const initialX = useRef<number>(0);
  const startingLeftWidth = useRef<number>(leftWidth);

  // Handle the start of dragging
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);

    // Handle either mouse or touch event
    if ('clientX' in e) {
      initialX.current = e.clientX;
    } else {
      initialX.current = e.touches[0].clientX;
    }

    startingLeftWidth.current = leftWidth;
  };

  // Handle the dragging motion
  const handleDrag = (clientX: number) => {
    if (!isDragging || !splitPaneRef.current) return;

    const containerWidth = splitPaneRef.current.offsetWidth;
    const deltaX = clientX - initialX.current;
    const newLeftWidth = Math.max(
      minLeftWidth,
      Math.min(
        startingLeftWidth.current + (deltaX / containerWidth) * 100,
        100 - minRightWidth
      )
    );

    setLeftWidth(newLeftWidth);
  };

  // Handle mouse dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleDrag(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Handle touch dragging
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      handleDrag(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <div className="flex h-screen flex-col overflow-hidden font-sans" style={{ userSelect: isDragging ? "none" : "auto" }}>
      {embed ? null : (
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <span className="font-semibold text-lg">
            Online JavaScript Runner
          </span>
        </header>

      )}
      <section className="flex flex-1 w-full" ref={splitPaneRef}>
        <div className="overflow-hidden" style={{ width: `${leftWidth}%` }}>
          <MonacoEditor
            initValue={initValue}
            onValueChange={setEditorValue}
            language="javascript"
          ></MonacoEditor>
        </div>
        {/* Resizer */}
        <div className="relative flex items-center justify-center">
          <div
            className={clsx(
              "absolute h-full w-px hover:w-1 transition-all bg-gray-200 hover:bg-blue-500 z-10 cursor-col-resize flex items-center justify-center shrink-0", isDragging && 'bg-blue-500 w-1')}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
          </div>

        </div>
        <div className="flex flex-col flex-1" style={{ pointerEvents: isDragging ? 'none' : 'unset' }}>
          <WebviewWrapper doc={doc} />
          {/* Console */}
          <ConsoleOutput consoleValue={consoleValue} />
        </div>
      </section>
    </div>
  );
}
