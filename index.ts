import {
	KxModalComponent,
	KxModalComponentRef
} from './src/modal.component';

import {
	BOOTSTRAP3,
	BOOTSTRAP4,
	FOUNDATION6,
	SEMANTIC2
} from './src/configurations/index';

import {
	KxModalModule,
	KxModalRootModule
} from './src/modal.module';

import {
	IKxModalComponentType,
	IKxModalService,

	IKxModalStyling,
	IKxModalStylingAnimation,

	IKxModalConfiguration,
	IKxModalConfigurationSettings,
	IKxModalConfigurationValues,

	IKxModalComponentCreationConfiguration,
	IKxModalContainerCreator,
	IKxModalContainerService
} from './src/modal.models';

import {
	KxModalService
} from './src/modal.service';

import {
	KX_MODAL_STYLING_TOKEN
} from './src/modal.tokens';

export {
	KxModalComponent,
	KxModalComponentRef,

	KxModalModule,
	KxModalRootModule,

	KxModalService,
	IKxModalService,

	IKxModalComponentType,
	IKxModalStyling,
	IKxModalStylingAnimation,

	IKxModalConfiguration,
	IKxModalConfigurationSettings,
	IKxModalConfigurationValues,

	IKxModalComponentCreationConfiguration,
	IKxModalContainerCreator,
	IKxModalContainerService,

	KX_MODAL_STYLING_TOKEN,
	BOOTSTRAP3,
	BOOTSTRAP4,
	FOUNDATION6,
	SEMANTIC2
};
