import { CreateUI } from '~Core/Utilities/CreateUI';
import { Engine } from './Core/Engine';
import { InputReferences } from './Core/Utilities/InputReferences';
require('./Assets/IndexStyles.css');

(() => {
	CreateUI.bootStrapUI();
	const inputReferences = new InputReferences();
	const engine = new Engine(inputReferences);
	engine.start();
})();
