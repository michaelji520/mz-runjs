import { useMemo } from "react";

interface IWebviewWrapper {
  doc?: string
}
export function WebviewWrapper(props: IWebviewWrapper) {
  const { doc = '' } = props;

  const src = useMemo(() => {
    return URL.createObjectURL(new Blob([doc], { type: 'text/html' }));
  }, [doc]);

  return (
    <div className="w-full flex-1 flex flex-col overflow-hidden">
      <div className="font-semibold pl-2 bg-slate-100 h-7 leading-7 dark:bg-slate-600 dark:text-slate-200">Webview</div>

      <iframe
        src={src}
        sandbox="allow-same-origin allow-scripts allow-modals allow-forms allow-popups"
        className="w-full flex-1"
      ></iframe>
    </div>

  );


}