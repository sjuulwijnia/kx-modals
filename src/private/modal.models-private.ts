import { Subject } from "rxjs/Subject";

import { KxModalOptions, KxModalSettings, KxModalStyleSettings } from "../modal.models";

export const KX_MODAL_ANIMATION_TIME = 200; // ms
export const KX_MODAL_STATE_HIDE = 'kxModalAnimationHide';
export const KX_MODAL_STATE_SHOW = 'kxModalAnimationShow';

export const ROOT_MODAL_MODULE_CONFIGURATION_PROVIDER = "kxModalRootModuleSettings";

export const DEFAULT_MODAL_SETTINGS: KxModalSettings = {
	modalContainerClasses: '',
	modalDialogClasses: '',

	dismissByClick: true,
	dismissByEscape: true,
	dismissCausesError: false
};

export const GLOBAL_MODAL_STYLE_BOOTSTRAP3: KxModalStyleSettings = {
	backdropClasses: 'modal-backdrop',
	containerClasses: 'modal',
	dialogClasses: 'modal-dialog'
};

export const GLOBAL_MODAL_STYLE_BOOTSTRAP4: KxModalStyleSettings = {
	backdropClasses: 'modal-backdrop',
	containerClasses: 'modal',
	dialogClasses: 'modal-dialog'
};

export const GLOBAL_MODAL_STYLE_FOUNDATION6: KxModalStyleSettings = {
	backdropClasses: 'kx-modals-backdrop',
	containerClasses: 'kx-modals-container',
	dialogClasses: 'kx-modals-dialog reveal'
};

export interface KxModalConfiguration<RETURN_TYPE> {
	component: any;
	options: KxModalOptions;
	subject?: Subject<RETURN_TYPE>;
};
