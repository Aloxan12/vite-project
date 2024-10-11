import { importShared } from './__federation_fn_import-67cb31d6.js';
import { j as jsxRuntimeExports } from './__federation_expose_Components-bb31db46.js';
import { r as reactDomExports } from './__federation_shared_react-dom-e806fc46.js';
import App from './__federation_expose_TodoList-360ab5c2.js';

var client = {};

var m = reactDomExports;
{
  client.createRoot = m.createRoot;
  client.hydrateRoot = m.hydrateRoot;
}

const index = '';

const React = await importShared('react');
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);
