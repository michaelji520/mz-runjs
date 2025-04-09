import ReactDOM from "react-dom/client";
import "@/common/global.less";
import {App} from "./app";

import { initMonacoWorkers } from "./common/initMonacoWorkers";

initMonacoWorkers();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
