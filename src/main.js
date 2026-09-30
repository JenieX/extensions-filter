import { asserted } from '../node_modules/@jeniex/utils/browser/index.js';
import './my-mouse-gestures.js';

/**
 * @typedef {{
 *   enabled: boolean;
 *   disabled: boolean;
 *   search: string[];
 * }} State
 */

function getExtensionsElements() {
  return /** @type {HTMLElement[]} */ ([
    ...asserted(
      document
        .querySelector('body > extensions-manager')
        ?.shadowRoot?.querySelector('#itemsList, #items-list')
        ?.shadowRoot?.querySelector('div[class="items-container"]')
        ?.querySelectorAll('extensions-item'),
    ),
  ]);
}

/** @param {State} state */
function filterExtensionsElements(state) {
  // console.log(state);

  for (const element of getExtensionsElements()) {
    const cardElement = /** @type {HTMLDivElement} */ (
      element.shadowRoot?.querySelector('#card')
    );

    const extensionName = asserted(
      cardElement.querySelector('#name')?.textContent?.trim()?.toLowerCase(),
    );

    const isEnabled = cardElement.matches('.enabled');
    const isDisabled = !isEnabled;

    /** @type {boolean} */
    let matchesSearch = false;

    if (state.search.length === 0) {
      matchesSearch = true;
    } else {
      for (const term of state.search) {
        if (extensionName.includes(term)) {
          matchesSearch = true;
          break;
        }
      }
    }

    if (isEnabled) {
      if (state.enabled === true && matchesSearch) {
        element.style.removeProperty('display');
      } else {
        element.style.setProperty('display', 'none');
      }
    }

    if (isDisabled) {
      if (state.disabled === true && matchesSearch) {
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
  <input
    type="search"
    id="search"
    placeholder="Search extensions..."
    autocomplete="off"
    spellcheck="false"
  >

  <div id="filter-options">
    <label>
      <input type="checkbox" id="show-enabled" checked>
      Enabled
    </label>

    <label>
      <input type="checkbox" id="show-disabled" checked>
      Disabled
    </label>
  </div>
`;

Object.assign(filter.style, {
  position: 'fixed',
  bottom: '10px',
  left: '10px',
  zIndex: '999999',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
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

const search = /** @type {HTMLInputElement} */ (
  filter.querySelector('#search')
);

Object.assign(search.style, {
  width: '220px',
  boxSizing: 'border-box',
  padding: '6px 8px',
  border: '1px solid #5f6368',
  borderRadius: '4px',
  background: '#202124',
  color: '#e8eaed',
  outline: 'none',
});

const showEnabled = /** @type {HTMLInputElement} */ (
  filter.querySelector('#show-enabled')
);
const showDisabled = /** @type {HTMLInputElement} */ (
  filter.querySelector('#show-disabled')
);

// showEnabled.checked = false;
// showDisabled.checked = false;

/** @type {State} */
let state = {
  enabled: showEnabled.checked,
  disabled: showDisabled.checked,
  search: [],
};

showEnabled.addEventListener('change', () => {
  state = { ...state, enabled: showEnabled.checked };

  filterExtensionsElements(state);
});

showDisabled.addEventListener('change', () => {
  state = { ...state, disabled: showDisabled.checked };

  filterExtensionsElements(state);
});

let searchTimeout;
search.addEventListener('input', () => {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    state = {
      ...state,
      search: search.value.split('|'),
    };

    filterExtensionsElements(state);
  }, 500);
});

// await sleep(300);
// filterExtensionsElements(state);
