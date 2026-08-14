// This file is required by karma.conf.js and loads recursively all the .spec and framework files

// tslint:disable-next-line:no-import-side-effect
import "zone.js/dist/zone-testing";
import { getTestBed } from "@angular/core/testing";
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { useStandard } from "./standard";

// Inject object methods.
useStandard();

Error.stackTraceLimit = Infinity;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
}
);
