import {
	animate, state, style, transition, trigger,
	AnimationBuilder, AnimationFactory, AnimationMetadata, AnimationPlayer
} from '@angular/animations';
import {
	Component, ComponentFactory, ComponentFactoryResolver, ComponentRef,
	Inject,
	AfterViewInit, OnDestroy, OnInit,
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
	IKxModalStylingAnimationWithFactory,
	IKxModalStylingAnimationWithCallbacks,
	IKxModalConfiguration,
	IKxModalConfigurationSettings,
	IKxModalConfigurationValues,
	IKxModalComponentCreationConfiguration,
	IKxModalContainerCreator
} from '../modal.models';

import { KxModalContainerStaticAnimationManager, KxModalContainerModalAnimationManager } from './animation-managers/index';
import { KxModalContainerService } from './modal-container.service';

import { KX_MODAL_STYLING_TOKEN } from '../modal.tokens';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'kx-modal-container',
	template: `
		<div (click)="closeTopComponentByContainerEvent('closeOnBackdropClick', $event)">
			<ng-template #modalContainer></ng-template>
		</div>`,
	styles: [`.kx-modal-visible { display: block; opacity: 1; }`]
})
export class KxModalContainerComponent implements IKxModalContainerCreator, AfterViewInit, OnDestroy, OnInit {
	@ViewChild('modalContainer', { read: ViewContainerRef }) private modalComponentContainerRef: ViewContainerRef;
	private modalComponentRefConfigurations: KxModalComponentRefConfiguration<any>[] = [];

	private readonly bodyStyling: string | IKxModalStylingAnimation = null;
	private readonly modalBackdropStyling: string | IKxModalStylingAnimation = null;
	private readonly modalContainerStyling: string | IKxModalStylingAnimation = null;
	private readonly modalStyling: string | IKxModalStylingAnimationWithCallbacks = null;

	private modalBackdropManager: KxModalContainerStaticAnimationManager = null;
	private modalBodyManager: KxModalContainerStaticAnimationManager = null;
	private modalContainerManager: KxModalContainerStaticAnimationManager = null;

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
			return `${this.modalContainerManager.styling.classes} kx-modal-visible`;
		}

		return '';
	}

	private escapeKeydownSubscription: Subscription = null;

	constructor(
		private readonly animationBuilder: AnimationBuilder,
		private readonly componentFactoryResolver: ComponentFactoryResolver,
		private readonly modalContainerService: KxModalContainerService,
		private readonly renderer: Renderer2,

		@Inject(KX_MODAL_STYLING_TOKEN) private readonly modalModuleStyling: IKxModalStyling
	) {
		this.modalContainerService.registerContainerComponent(this);

		this.bodyStyling = modalModuleStyling.body;
		this.modalBackdropStyling = modalModuleStyling.modalBackdrop;
		this.modalContainerStyling = modalModuleStyling.modalContainer;
		this.modalStyling = modalModuleStyling.modal;
	}

	ngOnInit() {
		this.escapeKeydownSubscription = Observable
			.fromEvent(document, 'keydown', $event => $event)
			.subscribe($event => {
				this.closeTopComponentByContainerEvent('closeOnEscape', $event);
			});
	}

	ngAfterViewInit() {
		this.modalBodyManager = new KxModalContainerStaticAnimationManager(
			this.animationBuilder,
			document.body,
			this.renderer,
			this.bodyStyling,
			this.modalComponentContainerRef
		);

		this.modalContainerManager = new KxModalContainerStaticAnimationManager(
			this.animationBuilder,
			this.modalComponentContainerRefParent,
			this.renderer,
			this.modalContainerStyling,
			this.modalComponentContainerRef
		);
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
	public create<T extends KxModalComponent<D>, D>(
		configuration: IKxModalComponentCreationConfiguration<T, D>
	): T {

		// create the modal component
		const componentRefConfiguration = this.createModalComponent<T, D>(configuration);
		if (!componentRefConfiguration) {
			return new Observable(observer => {
				observer.error(`
				No modal could be created for the given component (${configuration.component.name}).
				Are you sure it has been added to the entryComponent of the containing NgModule?
				Can all dependencies be resolved?
			`);
			}) as any;
			// TODO: fix any
		}

		// subscribe on the componentRef.instance
		// we need the subscribe().add(...) call in order to remove the modal from view again
		// TODO: remove any
		(componentRefConfiguration.componentRef.instance as any)
			.subscribe({
				// must catch errors to avoid uncaught exceptions
				error: () => { }
			})
			.add(() => {
				this.deleteModalComponent(componentRefConfiguration, configuration);
			});

		return componentRefConfiguration.componentRef.instance;
	}

	/**
	 * Takes the top KxModalComponent and closes it if the eventType is configured to close it.
	 *
	 * @param eventType The eventType that closes the upper componentRef.
	 * @param $event The event that triggered the closing.
	 */
	public closeTopComponentByContainerEvent(
		eventType: 'closeOnEscape' | 'closeOnBackdropClick',
		$event: Event
	): void {

		// check if the event has been kx-modals canceled
		if ($event['KX-MODALS-CANCELLED']) {
			return;
		}

		// get the componentRef
		const componentRefConfiguration = this.modalComponentRefConfigurations[this.modalComponentRefConfigurations.length - 1];
		if (!componentRefConfiguration) {
			return;
		}

		// check whether this instance is closed by the given eventType
		const instance = componentRefConfiguration.componentRef.instance;
		if (!!instance.configuration.settings[eventType]) {

			// check whether it should generate an error
			if (!!instance.configuration.settings.closeCausesError) {
				instance.error(`Closed by '${eventType}' event`);
			} else {
				instance.closeSilent();
			}
		}
	}

	/**
	 * Creates a new modal with the given *configuration*.
	 *
	 * @param configuration The configuration used to create the new modal.
	 * @return The created KxModalComponentRef.
	 */
	private createModalComponent<T extends KxModalComponent<D>, D>(
		configuration: IKxModalComponentCreationConfiguration<T, D>
	): KxModalComponentRefConfiguration<T> {

		// retrieve the component factory; will error if it can't find the given ModalComponent as an entryComponent
		const componentFactory = configuration.componentFactoryResolver.resolveComponentFactory(configuration.component);
		if (!componentFactory) {
			return null;
		}

		// create the component from the factory; will error if it fails to initialize (missing dependencies, etc.)
		const componentRef = componentFactory.create(configuration.injector) as ComponentRef<T>;
		if (!componentRef) {
			return null;
		}

		// replace the afterViewInit(...) with the one of the configuration
		this.replaceComponentAfterViewInit(componentRef);

		// create the backdrop
		this.createModalBackdrop(configuration);
		this.modalBodyManager.inAnimation();
		this.modalContainerManager.inAnimation();

		// values have to be inserted BEFORE the component is inserted into the containerref
		// this ensures the values are available on a ngOnInit hook
		this.insertComponentValues(componentRef, configuration);

		// insert the component into the view and add it to the array container all modalComponents
		this.modalComponentContainerRef.insert(componentRef.hostView);

		// apply the classes from the config to the modal
		// this.attachComponentStyles(componentRef, configuration);
		const localStyling = this.createModalStylingPart(configuration.styling);
		const componentRefAnimationManager = new KxModalContainerModalAnimationManager(
			this.animationBuilder,
			this.modalStyling,
			localStyling,
			this.renderer,
			componentRef
		);

		componentRefAnimationManager.inAnimation();

		// add click handler that cancels bubbling when the modal is clicked
		this.renderer.listen(componentRef.location.nativeElement, 'click', $event => {
			$event['KX-MODALS-CANCELLED'] = true;
		});

		const componentRefConfiguration: KxModalComponentRefConfiguration<T> = {
			index: this.modalComponentContainerRef.length,
			componentRef,
			componentRefAnimationManager
		};

		// add the component to the list of configurations
		this.modalComponentRefConfigurations.push(componentRefConfiguration);

		// update the entire container
		this.updateContainer();

		return componentRefConfiguration;
	}

	/**
	 * Augments the given *componentRef*'s ``ngAfterViewInit`` function by the one that the configuration has, if set.
	 *
	 * @param componentRef The KxModalComponentRef which ``ngAfterViewInit`` should be augmented.
	 */
	private replaceComponentAfterViewInit<T>(componentRef: ComponentRef<T>): void {
		if (typeof (this.modalStyling) === 'string' || !this.modalStyling.afterViewInit) {
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
	 * Applies the given *configuration* to the given *componentRef* by inserting its values into the *componentRef*.
	 * @param componentRef The KxModalComponentRef to apply these values on.
	 * @param configuration The configuration that needs to be applied on the KxModalComponentRef.
	 */
	private insertComponentValues<T extends KxModalComponent<D>, D>(
		componentRef: ComponentRef<T>,
		configuration: IKxModalComponentCreationConfiguration<T, D>
	): void {

		(componentRef.instance as any).configuration = Object.seal(configuration);
		// TODO: remove any

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
	private deleteModalComponent<T extends KxModalComponent<D>, D>(
		componentRefConfiguration: KxModalComponentRefConfiguration<T>,
		configuration: IKxModalComponentCreationConfiguration<T, D>
	): void {

		// delete the modal backdrop
		this.deleteModalBackdrop(configuration);
		this.modalBodyManager.outAnimation({
			containerElementCount: this.modalComponentRefConfigurations.length
		});
		this.modalContainerManager.outAnimation({
			containerElementCount: this.modalComponentRefConfigurations.length
		});

		// apply outgoing classes
		componentRefConfiguration.componentRefAnimationManager.outAnimation({
			callback: () => {
				this.modalComponentContainerRef.remove(this.modalComponentContainerRef.indexOf(componentRefConfiguration.componentRef.hostView));
			}
		});

		// remove it from the configurations
		this.modalComponentRefConfigurations.splice(componentRefConfiguration.index, 1);

		// update the entire container
		this.updateContainer();
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
	private createModalBackdrop<T extends KxModalComponent<D>, D>(configuration: IKxModalComponentCreationConfiguration<T, D>): void {

		if (!!this.modalBackdropManager) {
			return;
		}

		// create the element, apply classes & add to body
		const backdrop = this.renderer.createElement('div');
		this.renderer.appendChild(this.modalComponentContainerRefParent, backdrop);

		// if backdrop close is configured, start listening
		this.renderer.listen(backdrop, 'click', $event => {
			this.closeTopComponentByContainerEvent('closeOnBackdropClick', $event);
		});

		this.modalBackdropManager = new KxModalContainerStaticAnimationManager(
			this.animationBuilder,
			backdrop,
			this.renderer,
			this.modalBackdropStyling,
			this.modalComponentContainerRef
		);

		this.modalBackdropManager.inAnimation();
	}

	/**
	 * Deletes the backdrop from view if there's one or zero modals visible.
	 *
	 * @param configuration The configuration used for the modal that deletes the backdrop.
	 */
	private deleteModalBackdrop<T extends KxModalComponent<D>, D>(configuration: IKxModalComponentCreationConfiguration<T, D>): void {

		if (this.modalComponentRefConfigurations.length > 1 || !this.modalBackdropManager) {
			return;
		}

		const backdropManager = this.modalBackdropManager;
		this.modalBackdropManager = null;

		backdropManager.outAnimation({
			containerElementCount: this.modalComponentRefConfigurations.length,
			callback: () => {
				this.renderer.removeChild(this.modalComponentContainerRefParent, backdropManager.element);
			}
		});
	}

	/**
	 * Updates all the currently open KxModalComponentRefs.
	 */
	private updateContainer() {
		const modalComponentCount = this.modalComponentRefConfigurations.length;
		for (let index = 0; index < modalComponentCount; index++) {
			this.updateComponent(index);
		}
	}

	/**
	 * Updates the KxModalComponentRef at the given *index*.
	 *
	 * @param index Index of the KxModalComponentRef that needs to be updated.
	 */
	private updateComponent(index: number): void {
		const modalComponentRefConfiguration = this.modalComponentRefConfigurations[index];
		const modalComponent = modalComponentRefConfiguration.componentRef.instance;
		const modalComponentElement = modalComponentRefConfiguration.componentRef.location.nativeElement as HTMLElement;

		this.renderer.setStyle(modalComponentElement, 'z-index', (1051 - (index * 2)));

		modalComponent['$$modalCount'] = this.modalComponentRefConfigurations.length;
		modalComponent['$$modalIndex'] = index;
		modalComponentRefConfiguration.index = index;
	}
}

export interface KxModalComponentRefConfiguration<T> {
	index: number;
	componentRef: ComponentRef<T>;
	componentRefAnimationManager: KxModalContainerModalAnimationManager;
}
