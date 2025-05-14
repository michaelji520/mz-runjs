interface IProps {
  consoleValue: (string | number)[][]
}

export function ConsoleOutput(props: IProps) {

  const { consoleValue = [] } = props;

  return (
    <div className="w-full flex-1 text-sm overflow-hidden flex flex-col">
      <div className="font-semibold pl-2 bg-slate-100 h-7 leading-7 dark:bg-slate-600 dark:text-slate-200">Console</div>
      <div className="font-mono flex-1 overflow-y-auto">{consoleValue.map((i, idx) => (
        <div key={idx} className="border-b-[0.5px] border-solid border py-[3px] pl-2">{
          i.map((j, subidx) => {
            if (typeof j === 'string') {
              return <span key={subidx}>{j}&nbsp;</span>;
            } else if (typeof j === 'number') {
              return <span key={subidx} className="text-[#0842a0] dark:text-blue-200">{j}</span>;
            }
          })
        }</div>
      ))}</div>
    </div>
  );
}