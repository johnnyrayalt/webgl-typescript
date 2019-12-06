import { CreateUI } from '~Core/Services/CreateUI';
import { Engine } from './Core/Engine';
import { InputReferences } from './Core/Services/InputReferences';
require('./Assets/IndexStyles.css');

window.onload = () => {
	CreateUI.bootStrapUI();
	const inputReferences = new InputReferences();
	const engine = new Engine(inputReferences);
	engine.start();
};
