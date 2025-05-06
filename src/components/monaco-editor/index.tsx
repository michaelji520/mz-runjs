import {
  useRef,
  useEffect,
  useImperativeHandle,
  ForwardedRef,
  forwardRef,
  useState,
} from "react";
import * as monaco from "monaco-editor";

export interface MonacoEditorHandle {
  editor: monaco.editor.IStandaloneCodeEditor | null;
}

export interface IMonacoEditor {
  tabSize?: number;
  initValue?: string;
  language?: string;
  cacheNameSpace?: string;
  onValueChange?: (val: string) => void;
}

function MonacoEditorInner(
  props: IMonacoEditor,
  ref: ForwardedRef<MonacoEditorHandle>
) {
  const {
    tabSize = 2,
    initValue = "",
    cacheNameSpace,
    language = "json",
    onValueChange,
  } = props;

  const container = useRef<HTMLDivElement>(null);
  const instance = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const textChangeRef = useRef<monaco.IDisposable | null>(null);

  const [isEditorValid, setIsEditorValid] = useState(false);

  useImperativeHandle(ref, () => ({
    get editor() {
      return instance.current;
    },
  }));

  const initEditorInst = () => {
    if (!container.current) {
      return;
    }
    instance.current = monaco.editor.create(container.current, {
      value: "",
      language: language,
      tabSize: tabSize,
      fontSize: 14,
      theme: "vs",
      automaticLayout: true,
      minimap: {
        enabled: false,
      },
    });
    setIsEditorValid(true);

    textChangeRef.current = instance.current.onDidChangeModelContent(() => {
      const val = instance.current?.getValue();
      onValueChange?.(val || "");
    });
  };

  useEffect(() => {
    initEditorInst();
    return () => {
      instance.current?.dispose();
      textChangeRef.current?.dispose();
      setIsEditorValid(false);
    };
  }, []);

  useEffect(() => {
    // Need to check editor instance has been inited and not disposed
    if (isEditorValid && initValue) {
      instance.current?.setValue(initValue);
    }
  }, [isEditorValid, initValue]);

  useEffect(() => {
    if (!isEditorValid) return;

    instance.current?.updateOptions({
      tabSize: tabSize,
    });
  }, [isEditorValid, tabSize]);

  return <div className="editor h-full" ref={container}></div>;
}

export const MonacoEditor = forwardRef(MonacoEditorInner);
