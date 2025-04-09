import { transform } from "@babel/standalone";

export interface TranspiledCodeType {
  iframeCode: string;
  sourceCode: string;
}

export const importsRegex =
  /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s].*([@\w/_-]+)["'\s].*/g;
export const pureRegex = /\/\*#__PURE__\*\//g;

export function replace(string: string, regex: RegExp, value = ""): string {
  return string.replace(regex, value).trim();
}

export function transpile(code: string): TranspiledCodeType {
  // ignore imports so Babel doesn't transpile it
  const codeToTranspile = replace(code, importsRegex);
  // the magic sauce used to transpile the code
  try {
    const options = { presets: ["es2015-loose", "react"] };
    const { code: transpiledCode } = transform(codeToTranspile, options);

    if (!transpiledCode) {
      // syntax errors get caught by the `error` listener
      throw new Error(`Something went wrong transpiling ${codeToTranspile}.`);
    }

    const hasImports = Boolean(code.match(importsRegex));
    const imports = code.match(importsRegex)?.join("\n") ?? "";

    return {
      // this is passed to `updateIframe`
      iframeCode: hasImports ? `${imports}\n${transpiledCode}` : transpiledCode,
      // this is passed to `updateSource`
      // ignore /*#__PURE__*/ from transpiled output to reduce noise
      sourceCode: replace(transpiledCode, pureRegex),
    };
  } catch (error) {
    return {
      iframeCode: code,
      sourceCode: code,
    };
  }
}
