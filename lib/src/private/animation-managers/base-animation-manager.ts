import { AnimationFactory } from '@angular/animations';
import { Renderer2 } from '@angular/core';

export abstract class KxModalBaseAnimationManager {
	constructor(
		public readonly element: HTMLElement,
		protected readonly renderer: Renderer2
	) { }

	public abstract inAnimation(callback?: () => void): boolean;
	public abstract outAnimation(callback?: () => void): boolean;

	/**
	 * Plays the animation given by the *animationFactory* on this manager's element.
	 * Calls the *callback* once the animation is done or if it's not played.
	 *
	 * @param animationFactory The factory that supplies the animation.
	 * @param callback The callback that needs to be called when the animation is done.
	 */
	protected playAnimation(animationFactory: AnimationFactory, callback: () => void): boolean {
		// check if there's actually an animation factory
		if (!animationFactory) {
			callback();
			return false;
		}

		// play the animation
		const player = animationFactory.create(this.element);
		player.onDone(() => {
			callback();
			player.destroy();
		});
		player.play();

		return true;
	}

	/**
	 * Applies all given *classes* to the manager's element.
	 *
	 * @param classes Classes to apply.
	 */
	protected applyClasses(classes: string): void {
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
	 *
	 * @param classes Classes to remove.
	 */
	protected removeClasses(
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
