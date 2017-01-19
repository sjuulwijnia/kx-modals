import { OpaqueToken } from "@angular/core";
import { Observer } from "rxjs/Observer";

import { IKxModalOptions, IKxModalSettings } from "../modal-external/modal.models";

export * from "../modal-external/modal.models";

export const KX_MODAL_ANIMATION_TIME = 200; // ms
export const KX_MODAL_STATE_HIDE = 'kxModalAnimationHide';
export const KX_MODAL_STATE_SHOW = 'kxModalAnimationShow';

export const DEFAULT_MODAL_SETTINGS_PROVIDER = new OpaqueToken("kxModalDefaultSettings");
export const DEFAULT_MODAL_SETTINGS: IKxModalSettings = {
	modalClasses: '',
	modalSize: 'md'
};

export interface KxModalConfiguration<RETURN_TYPE> {
	component: any;
	options: IKxModalOptions;
	observer?: Observer<RETURN_TYPE>;
};
