import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';

@Component({
	selector: 'kx-app-code',
	templateUrl: './app-code.component.html',
	styles: [
		'.--code-sample { overflow-x: auto; padding: 14px; margin: -14px; max-height: 500px; }',
		'.--code-sample-copy { position: absolute !important; right: 0; top: 5px; }',
		'.--code-sample-copy-container { position: relative; }'
	]
})
export class KxAppCodeComponent implements OnInit {
	@ViewChild('codeSampleContainer') public codeSampleContainer: ElementRef = null;
	@Input('codeSamples') public codeSamples: ICodeSample[] = [];
	public codeSampleIndex = 0;
	public codeSampleCopied = false;

	constructor(
		private readonly http: Http
	) { }

	ngOnInit() {
		this.codeSamples.forEach(codeSample => {
			if (!!codeSample.url) {
				const url = `https://raw.githubusercontent.com/sjuulwijnia/kx-modals/master/example/app/modals/${codeSample.url}`;
				this.http.get(url)
					.subscribe({
						next: response => {
							codeSample.code = response.text();
							codeSample.code = codeSample.code.replace(/\t/gmi, '  ');
						},

						error: error => {
							codeSample.code = `Unable to locate the code at the following URL:\n\n${url}`;
						}
					});
			} else {
				codeSample.code = codeSample.code.replace(/\t/gmi, '  ');
			}
		});
	}

	public onSetCodeSampleIndex($index: number) {
		if (this.codeSampleIndex === $index) {
			return;
		}

		this.codeSampleIndex = $index;
		this.codeSampleCopied = false;
	}

	public onCodeSampleCopy($event: Event) {
		// collection selection
		const selection = window.getSelection();
		const ranges: Range[] = [];
		for (let i = 0; i < selection.rangeCount; i++) {
			ranges[i] = selection.getRangeAt(i);
		}

		// select element and copy
		selection.selectAllChildren(this.codeSampleContainer.nativeElement);
		this.codeSampleCopied = document.execCommand('copy');

		// reset selection
		selection.removeAllRanges();
		for (let i = 0; i < ranges.length; i++) {
			selection.addRange(ranges[i]);
		}
	}
}

export interface ICodeSample {
	title: string;
	code?: string;
	url?: string;
}
