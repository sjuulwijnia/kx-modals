import { AnimationBuilder, AnimationFactory, AnimationMetadata } from '@angular/animations';
import { Renderer2 } from '@angular/core';

import { IKxModalStylingAnimationWithFactory } from '../../modal.models';

export abstract class KxModalBaseAnimationManager {
	constructor(
		public readonly element: HTMLElement,
		protected readonly animationBuilder: AnimationBuilder,
		protected readonly renderer: Renderer2,
	) { }

	public abstract inAnimation(callback?: () => void): boolean;

	public abstract outAnimation(configuration: {
		containerElementCount?: number,
		callback?: () => void
	}): boolean;

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

	/**
	 * Creates the *IKxModalStylingAnimationWithFactory* that contains all styling information for this part.
	 *
	 * @param styling The style object to be enriched.
	 * @return The *IKxModalStylingAnimationWithFactory* containing all styling information for this part.
	 */
	protected createModalStylingPart(
		styling: string | IKxModalStylingAnimationWithFactory
	): IKxModalStylingAnimationWithFactory {

		// if there's no styling, make it a string
		if (!styling) {
			styling = '';
		}

		// if the styling equals a string, make it the object
		if (typeof styling === 'string') {
			styling = {
				classes: styling,
				in: 'none',
				inClasses: '',
				out: 'none',
				outClasses: ''
			};
		}

		// compose the result using the object
		return {
			...styling,

			inFactory: this.createModalAnimationpart(styling.in),
			outFactory: this.createModalAnimationpart(styling.out)
		};
	}

	/**
	 * Creates an *AnimationFactory* based on the given *animations*.
	 *
	 * @param animations The animations to create an *AnimationFactory* of.
	 * @return The created *AnimationFactory* or if there are no animations.
	 */
	protected createModalAnimationpart(
		animations: AnimationMetadata | AnimationMetadata[] | 'none' = 'none'
	): AnimationFactory {

		// check if there's an animation available, if not, return null
		if (!animations || animations === 'none') {
			return null;
		}

		return this.animationBuilder.build(animations);
	}
}
