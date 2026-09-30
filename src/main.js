import { asserted } from '../node_modules/@jeniex/utils/browser/index.js';
import './my-mouse-gestures.js';

/** @typedef {{ enabled: boolean; disabled: boolean }} State */

function getExtensionsElements() {
  return /** @type {HTMLElement[]} */ ([
    ...asserted(
      document
        .querySelector('body > extensions-manager')
        ?.shadowRoot?.querySelector('#itemsList')
        ?.shadowRoot?.querySelector('div[class="items-container"]')
        ?.querySelectorAll('extensions-item'),
    ),
  ]);
}

/** @param {State} state */
function filterExtensionsElements(state) {
  // console.log(state);

  for (const element of getExtensionsElements() /* .slice(0, 3) */) {
    const cardElement = /** @type {HTMLDivElement} */ (
      element.shadowRoot?.querySelector('#card')
    );

    const isEnabled = cardElement.matches('.enabled');
    const isDisabled = !isEnabled;

    if (isEnabled) {
      if (state.enabled === true) {
        element.style.removeProperty('display');
      } else {
        element.style.setProperty('display', 'none');
      }
    }

    if (isDisabled) {
      if (state.disabled === true) {
        element.style.removeProperty('display');
      } else {
        element.style.setProperty('display', 'none');
      }
    }
  }
}

// ------------------------

const filter = document.createElement('div');

filter.innerHTML = `
  <label>
    <input type="checkbox" id="show-enabled" checked>
    Enabled
  </label>

  <label>
    <input type="checkbox" id="show-disabled" checked>
    Disabled
  </label>
`;

Object.assign(filter.style, {
  position: 'fixed',
  bottom: '10px',
  left: '10px',
  zIndex: '999999',
  padding: '10px 14px',
  background: '#292a2d',
  color: 'rgb(196, 199, 197)',
  borderRadius: '8px',
  boxShadow:
    'color(srgb 0 0 0 / 0.3) 0px 1px 2px 0px, color(srgb 0 0 0 / 0.15) 0px 2px 6px 2px',
  fontFamily: 'sans-serif',
  userSelect: 'none',
});

document.body.append(filter);

const showEnabled = /** @type {HTMLInputElement} */ (
  filter.querySelector('#show-enabled')
);
const showDisabled = /** @type {HTMLInputElement} */ (
  filter.querySelector('#show-disabled')
);

/** @type {State} */
let state = {
  enabled: showEnabled.checked,
  disabled: showDisabled.checked,
};

showEnabled.addEventListener('change', () => {
  state = { ...state, enabled: showEnabled.checked };

  filterExtensionsElements(state);
});

showDisabled.addEventListener('change', () => {
  state = { ...state, disabled: showDisabled.checked };

  filterExtensionsElements(state);
});
