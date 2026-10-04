/**
 * Asserts that an object is neither `null` nor `undefined` and returns it.
 *
 * If the object is `null` or `undefined`, a `TypeError` is thrown.
 * Otherwise, the object is returned with its type narrowed to `T`.
 *
 * @template T The type of the object.
 *
 * @param object The object to validate.
 *
 * @returns The validated object, narrowed to `T`.
 *
 * @throws {TypeError} If the object is `null` or `undefined`.
 *
 * @example
 * const object: string | undefined = Math.random() < 0.5 ? undefined : 'Hello';
 *
 * const string = asserted(object);
 *
 * // `object` is now typed as `string`.
 * console.log(string.length);
 */
function asserted(object) {
    if (object === null || object === undefined) {
        throw new TypeError('object is either null or undefined');
    }
    return object;
}

// https://greasyfork.org/en/scripts/4776-my-mouse-gestures

// ==UserScript==
// @name               My Mouse Gestures
// @name:zh-CN         我的鼠标手势
// @name:zh-TW         我的滑鼠手勢
// @description        A simple mouse gesture script
// @description:zh-CN  一个简单的鼠标手势脚本
// @description:zh-TW  一個簡單的滑鼠手勢腳本
// @version            0.1.8
// @include            *
// @run-at             document-start
// @grant              GM_openInTab
// @grant              window.close
// @namespace          https://greasyfork.org/users/4968
// @license            MIT
// ==/UserScript==

// --- Settings ---

const SENSITIVITY = 3; // 1 ~ 5
const TOLERANCE = 3; // 1 ~ 5

const funcs = {
  U: function () {
    document
      .querySelector('body > extensions-manager')
      ?.shadowRoot?.querySelector('#container')
      ?.scrollTo(0, 0);
  },
  D: function () {
    document
      .querySelector('body > extensions-manager')
      ?.shadowRoot?.querySelector('#container')
      ?.scrollTo(0, 1073741824);
  },
};

// ----------------

const s = 1 << ((7 - SENSITIVITY) << 1);
const t1 = Math.tan(0.15708 * TOLERANCE),
  t2 = 1 / t1;

let x, y, path;

const tracer = function (e) {
  let cx = e.clientX,
    cy = e.clientY,
    deltaX = cx - x,
    deltaY = cy - y,
    distance = deltaX * deltaX + deltaY * deltaY;
  if (distance > s) {
    let slope = Math.abs(deltaY / deltaX),
      direction = '';
    if (slope > t1) {
      direction = deltaY > 0 ? 'D' : 'U';
    } else if (slope <= t2) {
      direction = deltaX > 0 ? 'R' : 'L';
    }
    if (path.charAt(path.length - 1) !== direction) {
      path += direction;
    }
    x = cx;
    y = cy;
  }
};

window.addEventListener(
  'mousedown',
  function (e) {
    if (e.which === 3) {
      x = e.clientX;
      y = e.clientY;
      path = '';
      window.addEventListener('mousemove', tracer, false);
    }
  },
  false,
);

window.addEventListener(
  'contextmenu',
  function (e) {
    window.removeEventListener('mousemove', tracer, false);
    if (path !== '') {
      e.preventDefault();
      if (funcs.hasOwnProperty(path)) {
        funcs[path]();
      }
    }
  },
  false,
);

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

// filter.innerHTML = `
//   <input
//     type="search"
//     id="search"
//     placeholder="Search extensions..."
//     autocomplete="off"
//     spellcheck="false"
//   >

//   <div id="filter-options">
//     <label>
//       <input type="checkbox" id="show-enabled" checked>
//       Enabled
//     </label>

//     <label>
//       <input type="checkbox" id="show-disabled" checked>
//       Disabled
//     </label>
//   </div>
// `;

{
  const search = document.createElement('input');
  search.type = 'search';
  search.id = 'search';
  search.placeholder = 'Search extensions...';
  search.autocomplete = 'off';
  search.spellcheck = false;

  const filterOptions = document.createElement('div');
  filterOptions.id = 'filter-options';

  const enabledLabel = document.createElement('label');
  const showEnabled = document.createElement('input');

  showEnabled.type = 'checkbox';
  showEnabled.id = 'show-enabled';
  showEnabled.checked = true;

  enabledLabel.append(showEnabled, ' Enabled');

  const disabledLabel = document.createElement('label');
  const showDisabled = document.createElement('input');

  showDisabled.type = 'checkbox';
  showDisabled.id = 'show-disabled';
  showDisabled.checked = true;

  disabledLabel.append(showDisabled, ' Disabled');

  filterOptions.append(enabledLabel, disabledLabel);
  filter.append(search, filterOptions);
}

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
