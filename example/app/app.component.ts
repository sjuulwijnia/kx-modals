import { Component } from '@angular/core';

import { ICodeSample, KxAppCodeComponent } from './app-code.component';
import { ModalService } from './modals/modal.service';

import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'kx-root',
	templateUrl: './app.component.html',
	styles: [
		'.top-offset { margin-top: 30px; }'
	]
})
export class KxAppComponent {
	public confirmCodeSamples: ICodeSample[] = [
		{
			title: 'confirm-modal.component.ts',
			url: 'confirm-modal.component/confirm-modal.component.ts'
		},
		{
			title: 'confirm-modal.component.html',
			url: 'confirm-modal.component/confirm-modal.component.html'
		}
	];

	public notifyCodeSamples: ICodeSample[] = [
		{
			title: 'notify-modal.component.ts',
			url: 'notify-modal.component/notify-modal.component.ts'
		},
		{
			title: 'notify-modal.component.html',
			url: 'notify-modal.component/notify-modal.component.html'
		}
	];

	public promptCodeSamples: ICodeSample[] = [
		{
			title: 'prompt-modal.component.ts',
			url: 'prompt-modal.component/prompt-modal.component.ts'
		},
		{
			title: 'prompt-modal.component.html',
			url: 'prompt-modal.component/prompt-modal.component.html'
		}
	];

	public stackingCodeSamples: ICodeSample[] = [
		{
			title: 'stacking-modal.component.ts',
			url: 'stacking-modal.component/stacking-modal.component.ts'
		},
		{
			title: 'stacking-modal.component.html',
			url: 'stacking-modal.component/stacking-modal.component.html'
		}
	];

	public waitCodeSamples: ICodeSample[] = [
		{
			title: 'wait-modal.component.ts',
			url: 'wait-modal.component/wait-modal.component.ts'
		},
		{
			title: 'wait-modal.component.html',
			url: 'wait-modal.component/wait-modal.component.html'
		}
	];

	constructor(
		private readonly modalService: ModalService
	) { }

	public onConfirmDelete() {
		this.modalService
			.confirm({
				title: 'Delete this?',
				body: 'If you do this, you will lose this content forever.',

				confirmLabel: 'Delete it!',
				declineLabel: 'Wait, no! STOP!'
			})
			.subscribe();
	}

	public onConfirmSuperSure() {
		this.modalService
			.confirm({
				title: 'Are you sure?',
				body: 'This might have some grave consequences.',

				confirmLabel: 'I am sure.',
				declineLabel: 'No, stop, don\'t.'
			})
			.subscribe(() => {
				this.modalService
					.confirm({
						title: 'Like, really really sure?',
						body: 'Because this might have some really grave consequences if you\'re not.',

						confirmLabel: '...really sure.',
						declineLabel: 'Never mind!'
					})
					.subscribe();
			});
	}

	public onStack() {
		this.modalService.stacking().subscribe();
	}

	public onNotifySomethingHappened() {
		this.modalService
			.notify({
				title: 'Look out!',
				body: 'Something just happened!',

				okLabel: 'OK!'
			})
			.subscribe();
	}

	public onNotifyImportant() {
		this.modalService
			.notify({
				title: 'Attention!',
				body: 'This is some important information: 42!',

				okLabel: '..OK?'
			})
			.subscribe();
	}

	public onNotifyBanana() {
		this.modalService
			.notifyCustomInAndOutAnimation({
				title: 'Careful!',
				body: 'There\'s a banana there!',

				okLabel: 'Thanks!'
			})
			.subscribe();
	}

	public onWait(timeSeconds = 1, basic = false) {
		const subscription = Observable.timer(timeSeconds * 1000).subscribe();

		this.modalService
			.wait({
				title: 'A moment please',
				body: `Just have to finish some small tasks, probably takes about... ${timeSeconds} second${timeSeconds === 1 ? '' : 's'}.`,

				subscription,
				basic
			})
			.subscribe();
	}
}
