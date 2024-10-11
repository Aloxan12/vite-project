import { importShared } from './__federation_fn_import-67cb31d6.js';
import { r as reactExports } from './__federation_shared_react-85510186.js';

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production_min = {};

/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f=reactExports,k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};
function q(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return {$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}reactJsxRuntime_production_min.Fragment=l;reactJsxRuntime_production_min.jsx=q;reactJsxRuntime_production_min.jsxs=q;

{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}

var jsxRuntimeExports = jsxRuntime.exports;

const checkboxWrap = "_checkboxWrap_i80hs_2";
const checkbox = "_checkbox_i80hs_2";
const cls = {
	checkboxWrap: checkboxWrap,
	checkbox: checkbox,
	"checkbox-label": "_checkbox-label_i80hs_40"
};

const {memo} = await importShared('react');

const AppCheckbox = memo(({ id, value, onChange, text }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cls.checkboxWrap, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        id,
        className: cls.checkbox,
        name: id,
        type: "checkbox",
        checked: value,
        onChange: (e) => onChange?.(e.currentTarget.checked)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: id, className: cls["checkbox-label"], children: text })
  ] });
});

export { AppCheckbox, jsxRuntimeExports as j };
