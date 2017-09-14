import { animate, style, transition } from '@angular/animations';

import { IKxModalStyling } from '../modal.models';

/**
 * Default Bootstrap 3 styling; based on ``v3.3.7``.
 *
 * Includes animations.
 */
export const BOOTSTRAP3: IKxModalStyling = {
	body: 'modal-open',
	modalBackdrop: {
		classes: 'modal-backdrop',
		in: [
			style({
				opacity: 0
			}),
			animate('150ms ease-out', style({
				opacity: 0.5
			}))
		],
		out: [
			animate('150ms ease-out', style({
				opacity: 0
			}))
		]
	},
	modalContainer: 'modal',
	modal: {
		classes: 'modal-dialog',
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
