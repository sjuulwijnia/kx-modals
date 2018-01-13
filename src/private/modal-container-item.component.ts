import {
	AnimationBuilder
} from '@angular/animations';
import {
	Component, ComponentRef,
	ElementRef,

	Inject,

	Renderer2,

	ViewChild, ViewContainerRef
} from '@angular/core';

import { IKxModalContainerItemComponent, KxModalComponentContainerItemStatus } from './modal-container.models';
import { KxModalContainerService } from './modal-container.service';
import { KxModalContainerStaticAnimationManager, KxModalContainerModalAnimationManager } from './animation-managers/index';

import {
	KxModalComponent,
	KxModalComponentType
} from '../modal.component';

import {
	IKxModalComponentCreationConfiguration,

	IKxModalStyling,
	IKxModalStylingAnimationWithCallbacks
} from '../modal.models';

import { KX_MODAL_STYLING_TOKEN } from '../modal.configuration';

@Component({
	selector: 'kx-modal-container-item',
	template: '<ng-template #modal></ng-template>',
	styles: [
		`:host { display: block; }`,
		`:host.kx-hide { display: none !important; }`
	]
})
export class KxModalContainerItemComponent<MC extends KxModalComponent<RT>, RT> implements IKxModalContainerItemComponent {
	@ViewChild('modal', { read: ViewContainerRef }) public modalComponentViewContainerRef: ViewContainerRef;

	public modalComponentConfiguration: IKxModalComponentCreationConfiguration<MC, RT> = null;

	private modalComponentRef: ComponentRef<MC> = null;
	private modalComponentRefAnimationManager: KxModalContainerModalAnimationManager = null;

	public get modal() {
		return this.modalComponentRef.instance;
	}

	public modalContainerItemComponentRef: ComponentRef<KxModalContainerItemComponent<MC, RT>> = null;
	private modalContainerItemComponentRefAnimationManager: KxModalContainerStaticAnimationManager = null;

	private status: KxModalComponentContainerItemStatus = KxModalComponentContainerItemStatus.initial;
	public get destroyed(): boolean {
		return this.status === KxModalComponentContainerItemStatus.destroyed;
	}

	public get index(): number {
		return this.modal.modalIndex;
	}

	constructor(
		private readonly animationBuilder: AnimationBuilder,
		private readonly elementRef: ElementRef,
		private readonly modalContainerService: KxModalContainerService,
		private readonly renderer: Renderer2,

		@Inject(KX_MODAL_STYLING_TOKEN) private readonly modalModuleStyling: IKxModalStyling
	) { }

	/**
	 * Creates this modal and returns it.
	 *
	 * @return The modal if it is created, or null if it has been destroyed.
	 */
	public create(): MC {
		if (this.status === KxModalComponentContainerItemStatus.created) {
			return this.modal;
		}
		if (this.status === KxModalComponentContainerItemStatus.destroyed) {
			return null;
		}

		this.status = KxModalComponentContainerItemStatus.created;

		this.modalComponentRef = this.createModalComponent();
		this.modalComponentViewContainerRef.insert(this.modalComponentRef.hostView);
		this.modalComponentRefAnimationManager = new KxModalContainerModalAnimationManager(
			this.animationBuilder,
			this.modalModuleStyling.modal,
			this.modalComponentConfiguration.styling,
			this.renderer,
			this.modalComponentRef
		);
		this.modalComponentRefAnimationManager.inAnimation({
			containerElementCount: 0
		});

		this.modalContainerItemComponentRefAnimationManager = new KxModalContainerStaticAnimationManager(
			this.animationBuilder,
			this.elementRef.nativeElement,
			this.renderer,
			this.modalModuleStyling.modalContainer
		);
		this.modalContainerItemComponentRefAnimationManager.inAnimation({
			containerElementCount: 0
		});

		return this.modal;
	}

	/**
	 * Destroys this modal without resolving it. Does nothing if it doesn't exist.
	 */
	public destroy() {
		if (this.status !== KxModalComponentContainerItemStatus.created) {
			return;
		}

		this.status = KxModalComponentContainerItemStatus.destroyed;
		this.modalComponentRefAnimationManager
			.outAnimation({
				callback: () => {
					this.modalComponentRef.destroy();
					this.modalContainerItemComponentRef.destroy();
				}
			});

		this.modalContainerItemComponentRefAnimationManager.outAnimation({
			containerElementCount: 0
		});
	}

	/**
	 * Shows this modal.
	 */
	public show() {
		this.renderer.removeClass(this.elementRef.nativeElement, 'kx-hide');
		this.modalContainerItemComponentRefAnimationManager.inAnimation({
			containerElementCount: 0
		});
	}

	/**
	 * Hides this modal.
	 */
	public hide() {
		this.modalContainerItemComponentRefAnimationManager.outAnimation({
			containerElementCount: 0,
			callback: () => {
				this.renderer.addClass(this.elementRef.nativeElement, 'kx-hide');
			}
		});
	}

	/**
	 * Updates this modal to have a new *index* and *count*.
	 *
	 * @param index Modal's new index.
	 * @param count Current count of modals opened.
	 */
	public update(index: number, count: number) {
		this.modal['$$modalIndex'] = index;
		this.modal['$$modalCount'] = count;
	}

	private createModalComponent(): ComponentRef<MC> {
		const componentFactoryResolver = this.modalComponentConfiguration.componentFactoryResolver;
		const componentFactory = componentFactoryResolver.resolveComponentFactory(this.modalComponentConfiguration.component);
		const componentRef = componentFactory.create(this.modalComponentConfiguration.injector);

		this.insertModalConfiguration(componentRef);
		this.replaceComponentAfterViewInit(componentRef);

		return componentRef;
	}

	private insertModalConfiguration(componentRef: ComponentRef<MC>): void {
		const modal = componentRef.instance;

		modal.configuration = Object.seal(this.modalComponentConfiguration);
		modal['modalContainerItem'] = this;

		const values = this.modalComponentConfiguration.values;
		if (!values) {
			return;
		}

		const keys = Object.keys(values);
		for (const key of keys) {
			modal[key] = values[key];
		}
	}

	private replaceComponentAfterViewInit(componentRef: ComponentRef<MC>): void {
		const AFTER_VIEW_INIT = 'ngAfterViewInit';
		const modalStyling = this.modalModuleStyling.modal;
		if (typeof (modalStyling) === 'string' || !modalStyling[AFTER_VIEW_INIT]) {
			return;
		}

		const modal = componentRef.instance;
		const modalAfterViewInitOriginal = modal[AFTER_VIEW_INIT];
		const modalAfterViewInitStyling = modalStyling[AFTER_VIEW_INIT].bind(modal);
		if (!!modalAfterViewInitOriginal) {
			modal[AFTER_VIEW_INIT] = function () {
				modalAfterViewInitOriginal.bind(modal)();
				modalAfterViewInitStyling(componentRef, this.renderer);
			}.bind(modal);
		} else {
			modal[AFTER_VIEW_INIT] = function () {
				modalAfterViewInitStyling(componentRef, this.renderer);
			}.bind(modal);
		}
	}
}
