import { IKxModalStylingAnimation } from './modal.configuration';

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
	 */
	closeOnEscape?: boolean;

	/**
	 * Whether this modal should close when the backdrop is clicked.
	 */
	closeOnBackdropClick?: boolean;

	/**
	 * Whether closing the modal by pressing escape or clicking on the backdrop should cause an error.
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
