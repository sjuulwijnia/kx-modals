import {
	animate, state, style, transition, trigger,
	AnimationBuilder, AnimationFactory, AnimationMetadata, AnimationPlayer
} from '@angular/animations';
import {
	Component, ComponentFactory, ComponentFactoryResolver, ComponentRef,
	Inject, Injector,
	AfterViewInit, OnDestroy, OnInit,
	Renderer2,
	ViewChild, ViewContainerRef
} from '@angular/core';

import {
	KxModalComponent
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

import { KxModalContainerItemComponent } from './modal-container-item.component';
import { KxModalContainerService } from './modal-container.service';

import { KX_MODAL_STYLING_TOKEN, KX_MODAL_BACKDROP_ZINDEX } from '../modal.configuration';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'kx-modal-container',
	template: `<ng-template #modalContainer></ng-template>`,
	styles: [`.kx-modal-visible { display: block; opacity: 1; }`]
})
export class KxModalContainerComponent implements IKxModalContainerCreator, AfterViewInit, OnDestroy, OnInit {
	@ViewChild('modalContainer', { read: ViewContainerRef }) public modalContainerRef: ViewContainerRef;
	private modalContainerItemRefs: ComponentRef<KxModalContainerItemComponent<any, any>>[] = [];

	private readonly bodyStyling: string | IKxModalStylingAnimation = null;
	private readonly modalBackdropStyling: string | IKxModalStylingAnimation = null;
	private readonly modalContainerStyling: string | IKxModalStylingAnimation = null;
	private readonly modalStyling: string | IKxModalStylingAnimationWithCallbacks = null;

	private modalBackdropManager: KxModalContainerStaticAnimationManager = null;
	private modalBodyManager: KxModalContainerStaticAnimationManager = null;

	public get modalComponentContainerRefParent(): HTMLElement {
		if (!this.modalContainerRef) {
			return null;
		}

		return this.modalContainerRef.element.nativeElement.parentElement;
	}

	public get hasModals(): boolean {
		return this.modalCount > 0;
	}

	public get modalCount(): number {
		if (!this.modalContainerRef) {
			return 0;
		}

		return this.modalContainerRef.length;
	}

	private escapeKeydownSubscription: Subscription = null;

	constructor(
		private readonly animationBuilder: AnimationBuilder,
		private readonly componentFactoryResolver: ComponentFactoryResolver,
		private readonly injector: Injector,
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
			.fromEvent(document, 'keydown', $event => ($event as KeyboardEvent))
			.subscribe($event => {
				this.closeOnEscape($event);
			});
	}

	ngAfterViewInit() {
		this.modalBodyManager = new KxModalContainerStaticAnimationManager(
			this.animationBuilder,
			document.body,
			this.renderer,
			this.bodyStyling
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
	public create<MC extends KxModalComponent<RT>, RT>(
		configuration: IKxModalComponentCreationConfiguration<MC, RT>
	): MC {

		const containerItemFactory = this.componentFactoryResolver.resolveComponentFactory(KxModalContainerItemComponent);
		const containerItem = containerItemFactory.create(this.injector);
		const containerItemInstance = containerItem.instance as KxModalContainerItemComponent<MC, RT>;

		containerItemInstance.modalComponentConfiguration = configuration;
		containerItemInstance.modalContainerItemComponentRef = containerItem;

		// insert into container
		this.modalContainerRef.insert(containerItem.hostView);

		// create actual modal component
		const modal = containerItemInstance.create();
		modal
			.subscribe({
				error: () => { }
			})
			.add(() => {
				this.afterModalDestroyed(containerItem);
			});

		this.afterModalCreated(containerItem);

		return modal;
	}

	private afterModalCreated(containerItemRef: ComponentRef<KxModalContainerItemComponent<any, any>>) {
		this.modalContainerItemRefs.push(containerItemRef);
		this.updateContainerItems();

		this.createModalBackdrop();
		this.modalBodyManager.inAnimation({
			containerElementCount: this.modalContainerItemRefs.length
		});

	}

	private afterModalDestroyed(containerItemRef: ComponentRef<KxModalContainerItemComponent<any, any>>) {
		containerItemRef.instance.destroy();

		this.modalContainerItemRefs.splice(containerItemRef.instance.index, 1);
		this.updateContainerItems();

		this.deleteModalBackdrop();
		this.modalBodyManager.outAnimation({
			containerElementCount: this.modalContainerItemRefs.length
		});
	}

	public closeOnBackdropClick($event: MouseEvent) {
		this.closeTopComponentByContainerEvent(KxModalComponentCloseReason.CloseOnBackdropClick, $event);
	}

	public closeOnEscape($event: KeyboardEvent) {
		if ($event.code === 'Escape') {
			this.closeTopComponentByContainerEvent(KxModalComponentCloseReason.CloseOnEscape, $event);
		}
	}

	/**
	 * Takes the top KxModalComponent and closes it if the eventType is configured to close it.
	 *
	 * @param eventType The eventType that closes the upper componentRef.
	 * @param $event The event that triggered the closing.
	 */
	private closeTopComponentByContainerEvent(
		eventType: KxModalComponentCloseReason,
		$event: Event
	): void {

		// check if the event has been kx-modals canceled
		if ($event['KX-MODALS-CANCELLED']) {
			return;
		}

		// get the componentRef
		const containerItem = this.modalContainerItemRefs[this.modalContainerItemRefs.length - 1];
		if (!containerItem) {
			return;
		}

		// check whether this instance is closed by the given eventType
		const instance = containerItem.instance.modal;
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
	private createModalBackdrop(): void {

		if (!!this.modalBackdropManager) {
			return;
		}

		// create the element, apply classes & add to body
		const backdrop = this.renderer.createElement('div');
		this.renderer.setStyle(backdrop, 'z-index', KX_MODAL_BACKDROP_ZINDEX);

		this.renderer.appendChild(this.modalComponentContainerRefParent, backdrop);

		// if backdrop close is configured, start listening
		this.renderer.listen(backdrop, 'click', $event => {
			this.closeTopComponentByContainerEvent(KxModalComponentCloseReason.CloseOnBackdropClick, $event);
		});

		this.modalBackdropManager = new KxModalContainerStaticAnimationManager(
			this.animationBuilder,
			backdrop,
			this.renderer,
			this.modalBackdropStyling
		);

		this.modalBackdropManager.inAnimation({
			containerElementCount: this.modalContainerItemRefs.length
		});
	}

	/**
	 * Deletes the backdrop from view if there's one or zero modals visible.
	 *
	 * @param configuration The configuration used for the modal that deletes the backdrop.
	 */
	private deleteModalBackdrop(): void {

		if (this.modalContainerItemRefs.length > 0 || !this.modalBackdropManager) {
			return;
		}

		const backdropManager = this.modalBackdropManager;
		this.modalBackdropManager = null;

		backdropManager.outAnimation({
			containerElementCount: this.modalContainerItemRefs.length,
			callback: () => {
				this.renderer.removeChild(this.modalComponentContainerRefParent, backdropManager.element);
			}
		});
	}

	/**
	 * Updates all the currently open KxModalComponentRefs.
	 */
	private updateContainerItems() {
		const modalComponentCount = this.modalContainerItemRefs.length;
		for (let index = 0; index < modalComponentCount; index++) {
			this.modalContainerItemRefs[index].instance.update(index, modalComponentCount);
		}
	}
}

export enum KxModalComponentCloseReason {
	CloseOnBackdropClick = 'closeOnBackdropClick',
	CloseOnEscape = 'closeOnEscape'
}

export interface KxModalComponentRefConfiguration<T> {
	index: number;
	componentRef: ComponentRef<T>;
	componentRefAnimationManager: KxModalContainerModalAnimationManager;
}
