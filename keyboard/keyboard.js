import * as keyLayouts from './keyLayouts.js';

const Keyboard = {
    elements: {
    	main: null,
    	keysContainer: null,
      	keys: []
    },

    eventHandlers: {
		oninput: null
    },

	properties: {
		value: '',
		capsLock: false
	},

	init() {
		// Create main elements: keyboard and keyboard keys container
		this.elements.main = document.createElement('div');
		this.elements.keysContainer = document.createElement('div');

		// Setup main elements
		this.elements.main.classList.add('keyboard', 'keyboard--hidden');
		this.elements.keysContainer.classList.add('keboard__keys');
		this.elements.keysContainer.appendChild(this._createKeys());

		this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

		// Add to DOM
		this.elements.main.appendChild(this.elements.keysContainer);
		document.body.appendChild(this.elements.main);

		// Use keyboard for elements with .use-keyboard-input
		document.querySelectorAll('.use-keyboard-input').forEach(element => {
			element.addEventListener('focus', () => {
				this.open(currentValue => {
					element.value = currentValue;
				});
			});
		});
	},

	_createKeys() {
		const fragment = document.createDocumentFragment();

		const keyLayout = keyLayouts.enQWERTYLayout;

		// Create html for an icon
		const createIconHTML = (icon_name) => {
			return `<i class="material-icons">${icon_name}</i>`;
		}

		for (const key in keyLayout) {
			// Create keyboard button
			const keyElement = document.createElement('button');
			const insertLineBreak = keyLayouts.enQWERTYLineBreaks.indexOf(key) !== -1;

			// Add attributes
			keyElement.setAttribute('type', 'button');
			keyElement.classList.add('keyboard__key');

			// Create symbol selector menu
			const dropDownDiv = document.createElement('div');
			dropDownDiv.classList.add('letter-menu');

			switch (key) {
				case 'clear':
					keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
					keyElement.innerHTML = createIconHTML('clear');

					keyElement.addEventListener('click', () => {
						this.properties.value = '';
						this._triggerEvent('oninput');
					});

					break;

				case 'backspace':
					keyElement.classList.add('keyboard__key--wide');
					keyElement.innerHTML = createIconHTML('backspace');

					keyElement.addEventListener('click', () => {
						this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
						this._triggerEvent('oninput');
					});

					break;

				case 'caps':
					keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
					keyElement.innerHTML = createIconHTML('keyboard_capslock');

					keyElement.addEventListener('click', () => {
						this._toggleCapsLock();
						keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
					});

					break;

				case 'enter':
					keyElement.classList.add('keyboard__key--wide');
					keyElement.innerHTML = createIconHTML('keyboard_return');

					keyElement.addEventListener('click', () => {
						this.properties.value += '\n';
						this._triggerEvent('oninput');
					});

					break;

				case 'space':
					keyElement.classList.add('keyboard__key--extra-wide');
					keyElement.innerHTML = createIconHTML('space_bar');

					keyElement.addEventListener('click', () => {
						this.properties.value += ' ';
						this._triggerEvent('oninput');
					});

					break;

				// characters
				default:
					keyElement.classList.add('keyboard__key--character');
					keyElement.textContent = key.toLowerCase();

					for (const symbol in keyLayout[key]) {
						const symbolElement = document.createElement('a');
						symbolElement.textContent = symbol + ' | ' + keyLayout[key][symbol]
						dropDownDiv.appendChild(symbolElement);

						symbolElement.addEventListener('click', () => {
							this.properties.value += symbol;
							this._triggerEvent('oninput');
						});
					}

					keyElement.appendChild(dropDownDiv);

					// keyElement.addEventListener('click', () => {
					// 	this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
					// 	this._triggerEvent('oninput');
					// });

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
		console.log(handlerName + ' triggered');

		if (typeof this.eventHandlers[handlerName] == 'function') {
			this.eventHandlers[handlerName](this.properties.value);
		}
	},

	_toggleCapsLock() {
		this.properties.capsLock = !this.properties.capsLock;

		for (const key of this.elements.keys) {
			if (key.childElementCount === 0) {
				key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
			}
		}

	},

	open(oninput) {
		this.eventHandlers.oninput = oninput;
		this.elements.main.classList.remove('keyboard--hidden');
	}
};

window.addEventListener('DOMContentLoaded', function () {
	Keyboard.init();
	document.getElementById('textbox').focus();
});