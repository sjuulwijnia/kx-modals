import "core-js";
import "zone.js";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";

platformBrowserDynamic().bootstrapModule(AppModule)
	.catch(error => {
		console.log(error);
	});
