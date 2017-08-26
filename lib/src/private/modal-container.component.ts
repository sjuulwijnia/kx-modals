import {
	animate, state, style, transition, trigger,
	AnimationBuilder, AnimationFactory, AnimationMetadata
} from '@angular/animations';
import {
	Component, ComponentFactory, ComponentFactoryResolver, ComponentRef,
	Inject,
	OnDestroy, OnInit,
	Renderer2,
	ViewChild, ViewContainerRef
} from '@angular/core';

import {
	KxModalComponent,
	KxModalComponentRef
} from '../modal.component';
import {
	IKxModalStyling,
	IKxModalStylingAnimation,
	IKxModalConfiguration,
	IKxModalConfigurationSettings,
	IKxModalConfigurationValues,
	IKxModalComponentCreationConfiguration,
	IKxModalContainerCreator,
	IKxModalStylingAnimationWithCallbacks
} from '../modal.models';

import { KxModalContainerService } from './modal-container.service';

import { KX_MODAL_STYLING_TOKEN } from '../modal.tokens';

import { Observable } from 'rxjs/Observable';

export interface IKxModalStylingAnimationWithFactory extends IKxModalStylingAnimationWithCallbacks {
	inFactory?: AnimationFactory;
	outFactory?: AnimationFactory;
}

@Component({
	selector: 'kx-modal-container',
	template: `<div [class]="containerClasses"><ng-template #modalContainer></ng-template></div>`,
	styles: [`.kx-modal-visible { display: block; }`]
})
export class KxModalContainerComponent implements IKxModalContainerCreator, OnDestroy, OnInit {
	@ViewChild('modalContainer', { read: ViewContainerRef }) private modalComponentContainerRef: ViewContainerRef;
	private modalComponentRefs: KxModalComponentRef<any>[] = [];

	private readonly bodyStyling: IKxModalStylingAnimationWithFactory = null;
	private readonly modalBackdropStyling: IKxModalStylingAnimationWithFactory = null;
	private readonly modalContainerStyling: IKxModalStylingAnimationWithFactory = null;
	private readonly modalStyling: IKxModalStylingAnimationWithFactory = null;

	private modalBackdropElement: HTMLElement = null;

	public get modalComponentContainerRefParent(): HTMLElement {
		if (!this.modalComponentContainerRef) {
			return null;
		}

		return this.modalComponentContainerRef.element.nativeElement.parentElement;
	}

	public get hasModals(): boolean {
		return this.modalCount > 0;
	}

	public get modalCount(): number {
		if (!this.modalComponentContainerRef) {
			return 0;
		}

		return this.modalComponentContainerRef.length;
	}

	public get containerClasses(): string {
		if (this.hasModals) {
			return `${this.modalContainerStyling.class} kx-modal-visible`;
		}

		return '';
	}

	private escapeKeydownSubscription = Observable
		.fromEvent(document, 'keydown', $event => $event)
		.subscribe($event => {
			this.closeTopComponentByContainerEvent('closeOnEscape', $event);
		});

	constructor(
		private readonly animationBuilder: AnimationBuilder,
		private readonly componentFactoryResolver: ComponentFactoryResolver,
		private readonly modalContainerService: KxModalContainerService,
		private readonly renderer: Renderer2,

		@Inject(KX_MODAL_STYLING_TOKEN) private readonly modalModuleStyling: IKxModalStyling
	) {
		this.modalContainerService.registerContainerComponent(this);

		this.bodyStyling = this.createModalStylingPart(modalModuleStyling.body);
		this.modalBackdropStyling = this.createModalStylingPart(modalModuleStyling.modalBackdrop);
		this.modalContainerStyling = this.createModalStylingPart(modalModuleStyling.modalContainer);
		this.modalStyling = this.createModalStylingPart(modalModuleStyling.modal);
	}

	ngOnInit() {

	}

	ngOnDestroy() {
		this.modalContainerService.unregisterContainerComponent();
		this.escapeKeydownSubscription.unsubscribe();
	}

	/**
	 * Creates a modal using the given *configuration*.
	 *
	 * @param configuration Configuration to use for creating the modal.
	 * @return The created modal.
	 */
	public create<T>(
		configuration: IKxModalComponentCreationConfiguration
	): KxModalComponent<T> {

		// create the modal component
		const componentRef = this.createModalComponent<T>(configuration);
		if (!componentRef) {
			return new Observable(observer => {
				observer.error(`
				No modal could be created for the given component (${configuration.component.name}).
				Are you sure it has been added to the entryComponent of the containing NgModule?
				Can all dependencies be resolved?
			`);
			}) as KxModalComponent<T>;
		}

		// subscribe on the componentRef.instance
		// we need the subscribe().add(...) call in order to remove the modal from view again
		componentRef.instance
			.subscribe({
				// must catch errors to avoid uncaught exceptions
				error: () => { }
			})
			.add(() => {
				this.deleteModalComponent(componentRef, configuration);
			});

		return componentRef.instance;
	}

	/**
	 * Creates a new modal with the given *configuration*.
	 *
	 * @param configuration The configuration used to create the new modal.
	 * @return The created KxModalComponentRef.
	 */
	private createModalComponent<T>(
		configuration: IKxModalComponentCreationConfiguration
	): KxModalComponentRef<T> {

		// retrieve the component factory; will error if it can't find the given ModalComponent as an entryComponent
		const componentFactory = configuration.componentFactoryResolver.resolveComponentFactory(configuration.component);
		if (!componentFactory) {
			return null;
		}

		// create the component from the factory; will error if it fails to initialize (missing dependencies, etc.)
		const componentRef = componentFactory.create(configuration.injector);
		if (!componentRef) {
			return null;
		}

		// replace the afterViewInit(...) with the one of the configuration
		this.replaceComponentAfterViewInit(componentRef);

		// create the backdrop
		this.createModalBackdrop(configuration);

		// values have to be inserted BEFORE the component is inserted into the containerref
		// this ensures the values are available on a ngOnInit hook
		this.insertComponentValues(componentRef, configuration);

		// insert the component into the view and add it to the array container all modalComponents
		this.modalComponentContainerRef.insert(componentRef.hostView);
		this.modalComponentRefs.push(componentRef);

		// apply the classes from the config to the modal
		this.attachComponentStyles(componentRef, configuration);

		// update the entire container
		this.updateContainer();

		return componentRef;
	}

	/**
	 * Attach all styles in the *configuration* to the given *componentRef*.
	 * Also does the *in* animation if supplied inside the *configuration*.
	 *
	 * @param componentRef The KxModalComponentRef to be enriched with the styles.
	 * @param configuration The configuration to be used for the styles.
	 */
	private attachComponentStyles<T>(
		componentRef: KxModalComponentRef<T>,
		configuration: IKxModalComponentCreationConfiguration
	): void {

		// get element
		const element = componentRef.location.nativeElement as HTMLElement;

		// get styling
		const configurationStyling = this.createModalStylingPart(configuration.styling);

		// apply global class + configuration class
		this.addClasses(element, `${this.modalStyling.class} ${configurationStyling.class}`.trim());
		this.renderer.setStyle(element, 'display', 'block');

		// determine the animationFactory to be used and animate if there's one
		const animationFactory = this.determineAnimationFactory(configurationStyling, this.modalStyling, 'in');

		componentRef.instance['$$isAnimating'] = this.playAnimation({
			animate: configuration.settings.animate,
			animationFactory: animationFactory,
			element: componentRef.location.nativeElement,

			callback: () => {
				componentRef.instance['$$isAnimating'] = false;
			}
		});
	}

	private replaceComponentAfterViewInit<T>(componentRef: KxModalComponentRef<T>) {
		if (!this.modalStyling.afterViewInit) {
			return;
		}

		const AFTER_VIEW_INIT = 'ngAfterViewInit';
		const instance = componentRef.instance;
		const instanceAfterViewInit = instance[AFTER_VIEW_INIT];
		const modalAfterViewInit = this.modalStyling.afterViewInit.bind(instance);
		const renderer = this.renderer;
		if (!!instanceAfterViewInit) {
			instance[AFTER_VIEW_INIT] = function () {
				instanceAfterViewInit.bind(instance)();
				modalAfterViewInit(componentRef, renderer);
			}.bind(instance);
		} else {
			instance[AFTER_VIEW_INIT] = function () {
				modalAfterViewInit(componentRef, renderer);
			}.bind(instance);
		}
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

	/**
	 * Applies all given *classes* to the given *element*.
	 * @param element HTMLElement to apply the classes to.
	 * @param classes Classes to apply.
	 */
	private addClasses(
		element: HTMLElement,
		classes: string
	): void {

		if (!classes) {
			return;
		}

		const splitClasses = classes.split(' ');
		for (const clazz of splitClasses) {
			this.renderer.addClass(element, clazz);
		}
	}

	/**
	 * Removes all given *classes* from the given *element*.
	 * @param element HTMLElement to remve the classes from.
	 * @param classes Classes to remove.
	 */
	private removeClasses(
		element: HTMLElement,
		classes: string
	): void {

		if (!classes) {
			return;
		}

		const splitClasses = classes.split(' ');
		for (const clazz of splitClasses) {
			this.renderer.removeClass(element, clazz);
		}
	}

	/**
	 * Applies the given *configuration* to the given *componentRef* by inserting its values into the *componentRef*.
	 * @param componentRef The KxModalComponentRef to apply these values on.
	 * @param configuration The configuration that needs to be applied on the KxModalComponentRef.
	 */
	private insertComponentValues<T>(
		componentRef: KxModalComponentRef<T>,
		configuration: IKxModalComponentCreationConfiguration
	): void {

		componentRef.instance.configuration = Object.seal(configuration);
		const values = configuration.values;
		if (!values) {
			return;
		}

		const component = componentRef.instance;
		const keys = Object.keys(values);
		for (const key of keys) {
			component[key] = values[key];
		}
	}

	/**
	 * Deletes the given *componentRef* from the view. If there's an out animation configured, it will do that first.
	 * @param componentRef The KxModalComponentRef to be removed from the view.
	 * @param configuration The configuration used to create this KxModalComponentRef.
	 */
	private deleteModalComponent<T>(
		componentRef: KxModalComponentRef<T>,
		configuration: IKxModalComponentCreationConfiguration
	): void {

		// delete the modal backdrop
		this.deleteModalBackdrop(configuration);

		// get styling
		const configurationStyling = this.createModalStylingPart(configuration.styling);

		// determine the animationFactory to be used and animate if there's one
		const animationFactory = this.determineAnimationFactory(configurationStyling, this.modalStyling, 'out');

		componentRef.instance['$$isAnimating'] = this.playAnimation({
			animate: configuration.settings.animate,
			animationFactory: animationFactory,
			element: componentRef.location.nativeElement,

			callback: () => {
				// get the component index
				const componentRefIndex = this.modalComponentRefs.indexOf(componentRef);
				if (componentRefIndex === -1) {
					return;
				}

				this.modalComponentRefs.splice(componentRefIndex, 1);
				componentRef.hostView.destroy();

				// update the entire container
				this.updateContainer();
			}
		});
	}

	/**
	 * Creates the *IKxModalStylingAnimationWithFactory* that contains all styling information for this part.
	 *
	 * @param styling The style object to be enriched.
	 * @return The *IKxModalStylingAnimationWithFactory* containing all styling information for this part.
	 */
	private createModalStylingPart(
		styling: string | IKxModalStylingAnimationWithFactory
	): IKxModalStylingAnimationWithFactory {

		// if there's no styling, make it a string
		if (!styling) {
			styling = '';
		}

		// if the styling equals a string, make it the object
		if (typeof styling === 'string') {
			styling = {
				class: styling,
				in: 'none',
				out: 'none'
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
	private createModalAnimationpart(
		animations: AnimationMetadata | AnimationMetadata[] | 'none' = 'none'
	): AnimationFactory {

		// check if there's an animation available, if not, return null
		if (!animations || animations === 'none') {
			return null;
		}

		return this.animationBuilder.build(animations);
	}

	/**
	 * Creates the backdrop for the modal if there is none.
	 *
	 * @param configuration The configuration used for the modal that created the backdrop.
	 */
	private createModalBackdrop(configuration: IKxModalComponentCreationConfiguration): void {

		if (!!this.modalBackdropElement) {
			return;
		}

		// create the element, apply classes & add to body
		const backdrop = this.renderer.createElement('div');
		this.addClasses(backdrop, this.modalBackdropStyling.class);
		this.renderer.appendChild(this.modalComponentContainerRefParent, backdrop);

		// if backdrop close is configured, start listening
		this.renderer.listen(backdrop, 'click', $event => {
			this.closeTopComponentByContainerEvent('closeOnBackdropClick', $event);
		});

		// animate if set
		this.playAnimation({
			animate: configuration.settings.animateBackdrop,
			animationFactory: this.modalBackdropStyling.inFactory,
			element: backdrop
		});
		this.modalBackdropElement = backdrop;
	}

	/**
	 * Deletes the backdrop from view if there's one or zero modals visible.
	 *
	 * @param configuration The configuration used for the modal that deletes the backdrop.
	 */
	private deleteModalBackdrop(
		configuration: IKxModalComponentCreationConfiguration
	): void {
		if (this.modalComponentContainerRef.length > 1 || !this.modalBackdropElement) {
			return;
		}

		const backdrop = this.modalBackdropElement;
		this.modalBackdropElement = null;

		this.playAnimation({
			animate: configuration.settings.animateBackdrop,
			animationFactory: this.modalBackdropStyling.outFactory,
			element: backdrop,
			callback: () => {
				this.renderer.removeChild(this.modalComponentContainerRefParent, backdrop);
			}
		});
	}

	/**
	 * Animates the given *element* using the *animationFactory*.
	 *
	 * @param element HTMLElement that needs to be animated.
	 * @param animationFactory AnimationFactory used to animate *element*. If null, nothing is animated.
	 * @param callback Callback to be called when the animation is done. If *animationFactory* is null, it will instantly be called.
	 * @return Whether an animation has been triggered or not.
	 */
	private playAnimation<T>(animationConfiguration: {
		animate: boolean;
		animationFactory: AnimationFactory;
		element: HTMLElement;
		callback?: () => void;
	}): boolean {
		const callback = animationConfiguration.callback || (() => { });
		const playAnimation = (!!animationConfiguration.animate && !!animationConfiguration.animationFactory);

		if (playAnimation) {
			const player = animationConfiguration.animationFactory.create(animationConfiguration.element);
			player.play();
			player.onDone(() => {
				player.destroy();

				callback();
			});
		} else {
			callback();
		}

		return playAnimation;
	}

	/**
	 * Updates all the currently open KxModalComponentRefs.
	 */
	private updateContainer() {
		const modalComponentCount = this.modalComponentRefs.length;
		for (let index = 0; index < modalComponentCount; index++) {
			this.updateComponent(index);
		}

		if (modalComponentCount === 0) {
			this.removeClasses(document.body, this.bodyStyling.class);
		} else {
			this.addClasses(document.body, this.bodyStyling.class);
		}
	}

	/**
	 * Updates the KxModalComponentRef at the given *index*.
	 *
	 * @param index Index of the KxModalComponentRef that needs to be updated.
	 */
	private updateComponent(index: number): void {
		const modalComponentRef = this.modalComponentRefs[index];
		const modalComponent = modalComponentRef.instance;
		const modalComponentElement = modalComponentRef.location.nativeElement as HTMLElement;

		this.renderer.setStyle(modalComponentElement, 'z-index', (1051 - (index * 2)));

		modalComponent['$$modalCount'] = this.modalComponentRefs.length;
		modalComponent['$$modalIndex'] = index;
	}

	/**
	 * Takes the top KxModalComponent and closes it if the eventType is configured to close it.
	 *
	 * @param eventType The eventType that closes the upper componentRef.
	 * @param $event The event that triggered the closing.
	 */
	private closeTopComponentByContainerEvent(
		eventType: 'closeOnEscape' | 'closeOnBackdropClick',
		$event: Event
	): void {

		// get the componentRef
		const componentRef = this.modalComponentRefs[this.modalComponentRefs.length - 1];
		if (!componentRef) {
			return;
		}

		// check whether this instance is closed by the given eventType
		const instance = componentRef.instance;
		if (!!instance.configuration.settings[eventType]) {

			// check whether it should generate an error
			if (!!instance.configuration.settings.closeCausesError) {
				instance.error('Closed by backdrop click');
			} else {
				instance.closeSilent();
			}
		}
	}
}
