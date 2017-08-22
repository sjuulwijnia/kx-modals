import { AnimationMetadata, animate, style } from '@angular/animations';
import { OpaqueToken } from '@angular/core';

export interface IKxModalStyling {
	/**
	 * The class that needs to be applied to the ``document.body`` when a modal is opened.
	 */
	body?: string;

	/**
	 * The class that needs to be applied to the modal backdrop (string).
	 *
	 * ``OR``
	 *
	 * The styling configuration used for the modal backdrop (IKxModalStylingAnimation).
	 */
	modalBackdrop?: string | IKxModalStylingAnimation;

	/**
	 * The class that needs to be applied to the modal container.
	 */
	modalContainer?: string;

	/**
	 * The class that needs to be applied to all the modal (string).
	 *
	 * ``OR``
	 *
	 * The styling configuration used for the all modal (IKxModalStylingAnimation).
	 */
	modal?: string | IKxModalStylingAnimation;
}

export interface IKxModalStylingAnimation {
	/**
	 * The class that needs to be appended to part that is configured.
	 */
	class: string;

	/**
	 * (Optional) Configure the *in* animation that is used for this part when a modal is created.
	 */
	in?: AnimationMetadata | AnimationMetadata[] | 'none';

	/**
	 * (Optional) Configure the *out* animation that is used for this part when a modal is created.
	 */
	out?: AnimationMetadata | AnimationMetadata[] | 'none';
}

/**
 * Default Bootstrap v3.3.7 styling for modals. Includes animations.
 */
export const BOOTSTRAP3: IKxModalStyling = {
	body: 'modal-open',
	modalBackdrop: {
		class: 'modal-backdrop',
		in: [
			style({
				opacity: 0
			}),
			animate('300ms ease-out', style({
				opacity: 0.5
			}))
		],
		out: [
			animate('300ms ease-out', style({
				opacity: 0
			}))
		]
	},
	modalContainer: 'modal',
	modal: {
		class: 'modal-dialog',
		in: [
			style({
				opacity: 0,
				transform: 'translate(0, -25%)'
			}),
			animate('300ms ease-out', style({
				opacity: 1,
				transform: 'translate(0, 0)'
			}))
		],
		out: [
			animate('300ms ease-out', style({
				opacity: 0,
				transform: 'translate(0, -25%)'
			}))
		]
	}
};

/**
 * Default Bootstrap v4.beta-01 styling. Includes animations.
 */
export const BOOTSTRAP4: IKxModalStyling = {
	body: 'modal-open',
	modalBackdrop: 'modal-backdrop',
	modalContainer: 'modal',
	modal: 'modal-dialog'
};

/**
 * Default Foundation 6 styling. Includes animations.
 */
export const FOUNDATION6: IKxModalStyling = {
	body: 'modal-open',
	modalBackdrop: 'kx-modals-backdrop',
	modalContainer: 'kx-modals-container',
	modal: 'kx-modals-dialog reveal'
};

export const MODAL_STYLING_TOKEN = new OpaqueToken('KxModalStyling');
