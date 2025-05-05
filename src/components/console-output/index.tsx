interface IProps {
  consoleValue: (string | number)[][]
}

export function ConsoleOutput(props: IProps) {

  const { consoleValue = [] } = props;

  return (
    <div className="w-full flex-1 text-sm overflow-hidden flex flex-col">
      <div className="font-semibold pl-2 bg-[#edf2fa] h-8 leading-8 border-t border-solid border-gray-200">Console</div>
      <div className="font-mono flex-1 overflow-y-auto">{consoleValue.map((i, idx) => (
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
  );
}