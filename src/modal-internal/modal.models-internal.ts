import { OpaqueToken } from "@angular/core";
import { Subject } from "rxjs/Subject";

import { IKxModalOptions, KxModalSettings, KxModalStyleSettings } from "../modal-external/modal.models";

export * from "../modal-external/modal.models";

export const KX_MODAL_ANIMATION_TIME = 200; // ms
export const KX_MODAL_STATE_HIDE = 'kxModalAnimationHide';
export const KX_MODAL_STATE_SHOW = 'kxModalAnimationShow';

export const DEFAULT_MODAL_SETTINGS_PROVIDER = new OpaqueToken("kxModalDefaultSettings");
export const DEFAULT_MODAL_SETTINGS: KxModalSettings = {
	modalContainerClasses: '',
	modalDialogClasses: '',

	dismissByClick: true,
	dismissByEscape: true,
	dismissCausesError: false
};

export const GLOBAL_MODAL_STYLE_PROVIDER = new OpaqueToken("kxModalGlobalStyleSettings");
export const GLOBAL_MODAL_STYLE: KxModalStyleSettings = {
	backdropClasses: 'modal-backdrop fade show',
	containerClasses: 'modal fade show',
	dialogClasses: 'modal-dialog'
};

export const MODAL_COMPONENT_DECLARATION_CONTAINER_PROVIDER = new OpaqueToken("kxModalComponentDeclarationContainer");

export interface KxModalConfiguration<RETURN_TYPE> {
	component: any;
	options: IKxModalOptions;
	subject?: Subject<RETURN_TYPE>;
};
