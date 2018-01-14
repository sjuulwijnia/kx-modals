export interface IKxModalContainerItemComponent {
	create(): void;
	destroy(): void;

	show(): void;
	hide(): void;
}

export enum KxModalComponentContainerItemStatus {
	initial = 1,
	created = 2,
	destroyed = 3
}
