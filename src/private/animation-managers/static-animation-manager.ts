

import { AnimationBuilder, AnimationFactory } from '@angular/animations';
import { ViewContainerRef, Renderer2 } from '@angular/core';

import { IKxModalStylingAnimation, IKxModalStylingAnimationWithFactory } from '../../modal.models';
import { KxModalBaseAnimationManager } from './base-animation-manager';

export class KxModalContainerStaticAnimationManager extends KxModalBaseAnimationManager {
	private _isVisible = false;
	public get isVisible() {
		return this._isVisible;
	}

	public styling: IKxModalStylingAnimationWithFactory = null;

	constructor(
		animationBuilder: AnimationBuilder,
		element: HTMLElement,
		renderer: Renderer2,
		styling: string | IKxModalStylingAnimation,
		private readonly viewContainerRef: ViewContainerRef
	) {
		super(element, animationBuilder, renderer);

		this.styling = this.createModalStylingPart(styling);
	}

	/**
	 * Plays the *in* animation of this manager's styling on its element.
	 *
	 * @param callback The callback that needs to be called when the animation is done.
	 */
	public inAnimation(callback?: () => void): boolean {

		// configure callbacks
		const outerCallback = callback || (() => { });
		const innerCallback = () => {
			outerCallback();
			this.removeClasses(this.styling.inClasses);
		};

		if (this.viewContainerRef.length > 0 || !!this._isVisible) {
			return false;
		}

		// is now visible
		this._isVisible = true;

		// apply in classes
		this.applyClasses(`${this.styling.inClasses || ''} ${this.styling.classes || ''}`);

		// play animation
		return this.playAnimation(this.styling.inFactory, innerCallback);
	}

	/**
	 * Plays the *out* animation of this manager's styling on its element.
	 *
	 * @param callback The callback that needs to be called when the animation is done.
	 */
	public outAnimation(configuration: {
		containerElementCount?: number,
		callback?: () => void
	}): boolean {

		// configure callbacks
		const outerCallback = configuration.callback || (() => { });
		const innerCallback = () => {
			outerCallback();
			this.removeClasses(`${this.styling.outClasses || ''} ${this.styling.classes || ''}`);
		};

		if (configuration.containerElementCount > 1 || !this._isVisible) {
			return false;
		}

		// is now invisible
		this._isVisible = false;

		// apply out classes
		this.applyClasses(this.styling.outClasses);

		// play animation
		return this.playAnimation(this.styling.outFactory, innerCallback);
	}
}
