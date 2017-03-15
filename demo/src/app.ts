import "core-js";
import "zone.js";

import "rxjs/add/observable/timer";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app.module";

platformBrowserDynamic().bootstrapModule(AppModule)
	.catch(error => {
		console.log(error);
	});
