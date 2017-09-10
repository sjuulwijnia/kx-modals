import { animate, style, transition } from '@angular/animations';
import { ComponentRef, Renderer2 } from '@angular/core/core';

import { KxModalComponent } from './modal.component';
import { IKxModalStyling } from './modal.models';

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

/**
 * Default Bootstrap 4 styling; based on ``v4.0.0-beta``.
 *
 * Includes animations.
 */
export const BOOTSTRAP4: IKxModalStyling = {
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
			animate('300ms ease-in-out', style({
				opacity: 1,
				transform: 'translate(0, 0)'
			}))
		],
		out: [
			animate('300ms ease-in-out', style({
				opacity: 0,
				transform: 'translate(0, -25%)'
			}))
		]
	}
};

/**
 * Default Semantic UI 2 styling; based on ``v2.2.0``.
 *
 * Includes animations.
 */
export const SEMANTIC2: IKxModalStyling = {
	body: 'dimmable dimmed',
	modalBackdrop: '',
	modalContainer: {
		classes: 'ui transition active page dimmer',
		in: animate('500ms'),
		inClasses: 'animating fade in',
		out: animate('500ms'),
		outClasses: 'animating fade out'
	},
	modal: {
		classes: 'ui transition active modal',
		in: animate('500ms'),
		inClasses: 'animating scale in',
		out: animate('500ms'),
		outClasses: 'animating scale out',

		afterViewInit: SEMANTIC2_AFTER_VIEW_INIT
	}
};

export function SEMANTIC2_AFTER_VIEW_INIT(componentRef: ComponentRef<KxModalComponent<any>>, renderer: Renderer2) {
	const element = componentRef.location.nativeElement;
	const marginOffset = -(element.scrollHeight / 2);

	renderer.setStyle(element, 'margin-top', `${marginOffset}px`);
}

/**
 * Default Foundation 6 styling; based on ``v6.4.2``.
 *
 * Includes *NO* animations.
 */
export const FOUNDATION6: IKxModalStyling = {
	body: 'is-reveal-open',
	modalBackdrop: '',
	modalContainer: 'reveal-overlay',
	modal: 'reveal'
};
