import { animate, style, transition } from '@angular/animations';
import { ComponentRef, Renderer2 } from '@angular/core/core';

import { KxModalComponent } from '../modal.component';
import { IKxModalStyling } from '../modal.models';

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
