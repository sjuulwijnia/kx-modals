import { Injectable } from '@angular/core';

@Injectable()
export class KxAppService {
	private currentClass: string = null;

	public setBodyClass(clazz: string) {
		if (clazz === this.currentClass) {
			return;
		}

		let bodyClazz = document.body.className;
		if (!!this.currentClass) {
			bodyClazz = bodyClazz.replace(this.currentClass, '').trim();
		}

		document.body.className = bodyClazz + ' ' + clazz;
		this.currentClass = clazz;
	}
}
