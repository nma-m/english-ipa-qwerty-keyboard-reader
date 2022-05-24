import * as keyLayouts from './keyLayouts.js';

const Keyboard = {
    elements: {
    	keyboardContainer: null,
    	keysContainer: null,
      	keys: []
    },

    eventHandlers: {
		oninput: null
    },

	properties: {
		value: '',
		caretPos: 0
	},

	init() {
		// Create main elements: keyboard and keyboard keys container
		this.elements.keyboardContainer = document.createElement('div');
		this.elements.keysContainer = document.createElement('div');

		// Setup main elements
		this.elements.keyboardContainer.classList.add('keyboard');
		this.elements.keysContainer.classList.add('keboard__keys');
		this.elements.keysContainer.appendChild(this._createKeys());

		this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

		// Add to DOM
		this.elements.keyboardContainer.appendChild(this.elements.keysContainer);
		document.getElementsByTagName('main')[0].appendChild(this.elements.keyboardContainer);

		// Use keyboard for elements with .use-keyboard-input
		document.querySelectorAll('.use-keyboard-input').forEach(element => {
			element.addEventListener('focus', () => {
				this.open(currentValue => {
					element.value = currentValue;
				});
			});
			
			element.addEventListener('blur', () => {
				// remember what's in the textbox and caret position
				this.properties.value = element.value;
				this.properties.caretPos = element.selectionStart;
			});
		});
	},

	_createKeys() {
		const fragment = document.createDocumentFragment();

		const keyLayout = keyLayouts.enQWERTYLayout;

		// [helper] Create html for an icon
		const createIconHTML = (icon_name) => {
			return `<span class="material-icons-outlined">${icon_name}</span>`;
		}

		// [helper] Insert input at caret
		const insertAtCaret = (input) => {
			const textBox = document.getElementById('textbox');
			if (textBox.selectionStart == textBox.selectionEnd) { // insert at caret
				this.properties.value = this.properties.value.substring(0, this.properties.caretPos)
					+ input
					+ this.properties.value.substring(this.properties.caretPos);
				this.properties.caretPos += input.length;
			} else { // replace selection
				var startPos = textBox.selectionStart;
				var endPos = textBox.selectionEnd;
				this.properties.value = this.properties.value.substring(0, startPos)
					+ input
					+ this.properties.value.substring(endPos, this.properties.value.length);
				this.properties.caretPos = startPos + input.length;
			}
		}

		for (const key in keyLayout) {
			// Create keyboard button
			const keyElement = document.createElement('button');
			const insertLineBreak = keyLayouts.enQWERTYLineBreaks.indexOf(key) !== -1;

			// Add attributes to keyboard key
			keyElement.setAttribute('type', 'button');
			keyElement.classList.add('keyboard__key');

			// Create symbol selector menu
			const dropDownDiv = document.createElement('div');
			dropDownDiv.classList.add('symbol-selector');

			// Define display behavoir of symbol selector menu
			keyElement.addEventListener('click', (e) => {
				if (!dropDownDiv.style.display) {
					dropDownDiv.style.display = 'block';
				} else {
					dropDownDiv.removeAttribute('style');
				}
			}, true);

			keyElement.addEventListener('mouseout', (e) => {
				if (!keyElement.contains(e.relatedTarget)) {
					dropDownDiv.removeAttribute('style');
				}
			});

			keyElement.addEventListener('focusout', (e) => {
				if (!keyElement.contains(e.relatedTarget)){
					dropDownDiv.removeAttribute('style');
				}
			});

			switch (key) {
				case 'clear':
					keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
					keyElement.innerHTML = createIconHTML('clear');

					keyElement.addEventListener('click', () => {
						this.properties.value = '';
						this.properties.caretPos = 0;
						this._triggerEvent('oninput');
					});

					break;

				case 'backspace':
					keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
					keyElement.innerHTML = createIconHTML('backspace');

					keyElement.addEventListener('click', () => {
						this.properties.value = this.properties.value.substring(0, this.properties.caretPos - 1) + this.properties.value.substring(this.properties.caretPos, this.properties.value.length);
						this.properties.caretPos -= 1;
						this._triggerEvent('oninput');
					});

					break;

				case 'space':
					keyElement.classList.add('keyboard__key--extra-wide');
					keyElement.innerHTML = createIconHTML('space_bar');

					keyElement.addEventListener('click', () => {
						insertAtCaret(' ');
						this._triggerEvent('oninput');
					});

					break;

				default: // letters and symbols
					keyElement.classList.add('keyboard__key--character');
					keyElement.textContent = key.toLowerCase();

					for (const symbol in keyLayout[key]) {
						// Create symbol button
						const symbolElement = document.createElement('button');
						symbolElement.textContent = symbol + ' | ' + keyLayout[key][symbol];
						// Add attributes to symbol
						symbolElement.setAttribute('type', 'button');
						symbolElement.classList.add('symbol');
						// Add symbol to symbol selector menu
						dropDownDiv.appendChild(symbolElement);

						symbolElement.addEventListener('click', (e) => {
							insertAtCaret(symbol);
							this._triggerEvent('oninput');
							dropDownDiv.style.display = null;
							keyElement.focus();
						});
					}

					// Add symbol selector menu to keyboard key
					keyElement.appendChild(dropDownDiv);

					break;
			};

			fragment.appendChild(keyElement);

			if (insertLineBreak) {
				fragment.appendChild(document.createElement('br'));
			};
		};

		return fragment;
	},

	_triggerEvent(handlerName) {
		if (typeof this.eventHandlers[handlerName] == 'function') {
			this.eventHandlers[handlerName](this.properties.value);
		}
	},

	open(oninput) {
		this.eventHandlers.oninput = oninput;
	}
};

window.addEventListener('DOMContentLoaded', function () {
	Keyboard.init();
	document.getElementById('textbox').focus();
});