import { animate, style, AnimationFactory, AnimationMetadata } from '@angular/animations';
import { ComponentFactoryResolver, ComponentRef, Injector, Renderer2 } from '@angular/core';

import { KxModalComponent } from './modal.component';

export interface IKxModalContainerCreator extends IKxModalContainerService {
	/**
	 * Creates a modal using the given *configuration*.
	 *
	 * @param configuration Configuration to use for creating the modal.
	 * @return The created modal.
	 */
	create<T>(configuration: IKxModalComponentCreationConfiguration): KxModalComponent<T>;
}

export interface IKxModalContainerService {
	/**
	 * Whether there are any modals currently open or not.
	 */
	readonly hasModals: boolean;

	/**
	 * The amount of modals currently open.
	 */
	readonly modalCount: number;
}

export interface IKxModalService extends IKxModalContainerService {
	create<T>(modalComponent: typeof KxModalComponent, modalConfiguration?: IKxModalConfiguration): KxModalComponent<T>;
}

export interface IKxModalComponentCreationConfiguration extends IKxModalConfiguration {
	component: typeof KxModalComponent;
	componentFactoryResolver: ComponentFactoryResolver;
	injector: Injector;
}

export interface IKxModalConfiguration {
	/**
	 * Settings to be used for this modal.
	 */
	settings?: IKxModalConfigurationSettings;

	/**
	 * Additional styling to be used for this modal.
	 * * Classes will be added to the default classes.
	 * * Animations will override the default animations.
	 */
	styling?: string | IKxModalStylingAnimation;

	/**
	 * Values that will be passed on to the modal. These values will share the same keys on the passed object as on the modal.
	 */
	values?: IKxModalConfigurationValues;
}

/**
 * Settings to be used for this modal.
 */
export interface IKxModalConfigurationSettings {
	/**
	 * Whether this modal should close when the escape key is pressed.
	 *
	 * *Default: true*
	 */
	closeOnEscape?: boolean;

	/**
	 * Whether this modal should close when the backdrop is clicked.
	 *
	 * *Default: true*
	 */
	closeOnBackdropClick?: boolean;

	/**
	 * Whether closing the modal by pressing escape or clicking on the backdrop should cause an error.
	 *
	 * *Default: false*
	 */
	closeCausesError?: boolean;

	/**
	 * Whether to animate the modal if it opens or closes.
	 * Won't have any effect if NoopAnimationsModule is used.
	 *
	 * *Default: true*
	 */
	animate?: boolean;

	/**
	 * Whether to animate the backdrop if this is the modal that creates the backdrop or removes the backdrop.
	 * Won't have any effect if NoopAnimationsModule is used.
	 *
	 * *Default: true*
	 */
	animateBackdrop?: boolean;
}
/**
 * Values that will be passed on to the modal. These values will share the same keys on the passed object as on the modal.
 */
export interface IKxModalConfigurationValues {
	[key: string]: any;
}

export abstract class IKxModalStyling {
	/**
	 * The class that needs to be applied to the ``document.body`` when a modal is opened.
	 *
	 * ``OR``
	 *
	 * The styling configuration used for the ``document.body`` (IKxModalStylingAnimation).
	 */
	body?: string | IKxModalStylingAnimation;

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
	 *
	 * ``OR``
	 *
	 * The styling configuration used for the modal container (IKxModalStylingAnimation).
	 */
	modalContainer?: string | IKxModalStylingAnimation;

	/**
	 * The class that needs to be applied to all the modals (string).
	 *
	 * ``OR``
	 *
	 * The styling configuration used for the all modals (IKxModalStylingAnimation).
	 */
	modal?: string | IKxModalStylingAnimation | IKxModalStylingAnimationWithCallbacks;
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

export interface IKxModalStylingAnimationWithCallbacks extends IKxModalStylingAnimation {
	/**
	 * Hooks into the Angular component life cycle, and is ran when a modal's ``ngAfterViewInit`` is called.
	 */
	afterViewInit?: (componentRef: ComponentRef<KxModalComponent<any>>, renderer: Renderer2) => void;
}

export interface IKxModalStylingAnimationWithFactory extends IKxModalStylingAnimationWithCallbacks {
	inFactory?: AnimationFactory;
	outFactory?: AnimationFactory;
}
