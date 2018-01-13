

import { AnimationBuilder, AnimationFactory } from '@angular/animations';
import { ComponentRef, ViewContainerRef, Renderer2 } from '@angular/core';

import { KxModalComponent } from '../../modal.component';
import { IKxModalStylingAnimation, IKxModalStylingAnimationWithFactory } from '../../modal.models';
import { KxModalBaseAnimationManager } from './base-animation-manager';

/**
 * This animation manager is used for the modal.
 */
export class KxModalContainerModalAnimationManager extends KxModalBaseAnimationManager {
	private _isVisible = false;
	public get isVisible() {
		return this._isVisible;
	}

	private globalStyling: IKxModalStylingAnimationWithFactory = null;
	private localStyling: IKxModalStylingAnimationWithFactory = null;

	constructor(
		animationBuilder: AnimationBuilder,
		globalStyling: string | IKxModalStylingAnimation,
		localStyling: string | IKxModalStylingAnimation,
		renderer: Renderer2,
		private readonly componentRef: ComponentRef<any>
	) {
		super(componentRef.location.nativeElement, animationBuilder, renderer);

		this.globalStyling = this.createModalStylingPart(globalStyling);
		this.localStyling = this.createModalStylingPart(localStyling);
	}

	/**
	 * Plays the *in* animation of this manager's styling on its element.
	 *
	 * @param callback The callback that needs to be called when the animation is done.
	 */
	public inAnimation(configuration: {
		containerElementCount?: number,
		callback?: () => void
	}): boolean {

		// configure callbacks
		const outerCallback = configuration.callback || (() => { });
		const innerCallback = () => {
			outerCallback();
			this.componentRef.instance['$$isAnimating'] = false;
			this.removeClasses(this.localStyling.inClasses);
		};

		if (!!this._isVisible) {
			return false;
		}

		// is now visible
		this._isVisible = true;

		// apply in classes
		this.applyClasses(this.globalStyling.inClasses || '');
		this.applyClasses(this.globalStyling.classes || '');
		this.applyClasses(this.localStyling.inClasses || '');
		this.applyClasses(this.localStyling.classes || '');

		// determine animationFactory
		const animationFactory = this.determineAnimationFactory(this.localStyling, this.globalStyling, 'in');

		// play animation
		const isAnimating = this.playAnimation(animationFactory, innerCallback);
		this.componentRef.instance['$$isAnimating'] = isAnimating;

		return isAnimating;
	}

	/**
	 * Plays the *out* animation of this manager's styling on its element.
	 *
	 * @param callback The callback that needs to be called when the animation is done.
	 */
	public outAnimation(configuration: {
		callback?: () => void
	}): boolean {

		// configure callbacks
		const outerCallback = configuration.callback || (() => { });
		const innerCallback = () => {
			outerCallback();
			this.removeClasses(this.globalStyling.outClasses || '');
			this.removeClasses(this.localStyling.outClasses || '');
		};

		if (!this._isVisible) {
			return false;
		}

		// is now invisible
		this._isVisible = false;

		// apply out classes
		this.applyClasses(`${this.globalStyling.outClasses || ''} ${this.localStyling.outClasses || ''}`);

		// determine animationFactory
		const animationFactory = this.determineAnimationFactory(this.localStyling, this.globalStyling, 'out');

		// play animation
		const isAnimating = this.playAnimation(animationFactory, innerCallback);
		this.componentRef.instance['$$isAnimating'] = isAnimating;

		return isAnimating;
	}

	/**
	 * Determines the *AnimationFactory* that needs to be used for animating the modal.
	 * The *local* animation is prioritized over the *global* animation.
	 *
	 * @param local Local styling configuration (for this modal only).
	 * @param global Global styling configuration (for all modals).
	 * @param type Animation to be used: in or out animation.
	 * @return The selected *AnimationFactory*, or null if there's no *AnimationFactory* to select.
	 */
	private determineAnimationFactory(
		local: IKxModalStylingAnimationWithFactory,
		global: IKxModalStylingAnimationWithFactory,
		type: 'in' | 'out'
	): AnimationFactory {

		const key = type + 'Factory';
		if (!!local[key]) {
			return local[key];
		} else if (!!global[key]) {
			return global[key];
		}

		return null;
	}
}
