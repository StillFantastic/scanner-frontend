declare global {
  interface Window {
    monaco: any;
  }
  interface HTMLInputElement {
    webkitdirectory?: boolean;
  }
}

export {};
