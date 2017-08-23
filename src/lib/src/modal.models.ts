import { KxModalComponent } from './modal.component';
import { IKxModalStylingAnimation } from './modal.configuration';

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
