

import { AnimationFactory } from '@angular/animations';
import { ViewContainerRef, Renderer2 } from '@angular/core';
import { IKxModalStylingAnimationWithFactory } from '../modal.models';

export class KxModalContainerAnimationManager {
	private _isVisible = false;
	public get isVisible() {
		return this._isVisible;
	}

	constructor(
		private readonly viewContainerRef: ViewContainerRef,
		public readonly element: HTMLElement,
		private readonly renderer: Renderer2,
		private readonly styling: IKxModalStylingAnimationWithFactory
	) { }

	public inAnimation(callback?: () => void): void {

		// configure callbacks
		const outerCallback = callback || (() => { });
		const innerCallback = () => {
			outerCallback();
			this.removeClasses(this.styling.inClasses);
		};

		if (this.viewContainerRef.length > 0 || !!this._isVisible) {
			return;
		}

		// is now visible
		this._isVisible = true;

		// apply in classes
		this.applyClasses(`${this.styling.inClasses} ${this.styling.classes}`);

		// play animation
		this.playAnimation(this.styling.inFactory, innerCallback);
	}

	public outAnimation(callback?: () => void): void {

		// configure callbacks
		const outerCallback = callback || (() => { });
		const innerCallback = () => {
			outerCallback();
			this.removeClasses(`${this.styling.outClasses} ${this.styling.classes}`);
		};

		if (this.viewContainerRef.length > 1 || !this._isVisible) {
			return;
		}

		// is now invisible
		this._isVisible = false;

		// apply out classes
		this.applyClasses(this.styling.outClasses);

		// play animation
		this.playAnimation(this.styling.outFactory, innerCallback);
	}

	private playAnimation(animationFactory: AnimationFactory, callback: () => void): void {
		// check if there's actually an animation factory
		if (!animationFactory) {
			callback();
			return;
		}

		// play the animation
		const player = animationFactory.create(this.element);
		player.onDone(() => {
			callback();
			player.destroy();
		});
		player.play();
	}

	/**
	 * Applies all given *classes* to the manager's element.
	 * @param classes Classes to apply.
	 */
	private applyClasses(classes: string): void {
		if (!classes) {
			return;
		}

		const splitClasses = classes.split(' ');
		for (const clazz of splitClasses) {
			if (!clazz) {
				continue;
			}

			this.renderer.addClass(this.element, clazz);
		}
	}

	/**
	 * Removes all given *classes* from the manager's element.
	 * @param classes Classes to remove.
	 */
	private removeClasses(
		classes: string
	): void {

		if (!classes) {
			return;
		}

		const splitClasses = classes.split(' ');
		for (const clazz of splitClasses) {
			if (!clazz) {
				continue;
			}

			this.renderer.removeClass(this.element, clazz);
		}
	}
}
