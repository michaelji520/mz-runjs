declare module "*.svg";
declare module "*.png";


declare module '*.module.less' {
  const classes: { [className: string]: string };
  export default classes;
}

declare interface Window {
  MonacoEnvironment?: any;
}