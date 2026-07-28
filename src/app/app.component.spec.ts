import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TestBed, waitForAsync } from "@angular/core/testing";

import { Platform } from "@ionic/angular";
import { StatusBar } from "@awesome-cordova-plugins/status-bar/ngx";

import { AppComponent } from "./app.component";

xdescribe("AppComponent", () => {
    let statusBarSpy, platformReadySpy, platformSpy;

    beforeEach(waitForAsync(() => {
        statusBarSpy = jasmine.createSpyObj("StatusBar", ["styleDefault"]);
        platformReadySpy = Promise.resolve();
        platformSpy = jasmine.createSpyObj("Platform", {
            ready: platformReadySpy,
        });

        TestBed.configureTestingModule({
            declarations: [AppComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: StatusBar, useValue: statusBarSpy },
                { provide: Platform, useValue: platformSpy },
            ],
        }).compileComponents();
    }));

    it("should create the app", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it("should initialize the app", async () => {
        TestBed.createComponent(AppComponent);
        expect(platformSpy.ready).toHaveBeenCalled();
        await platformReadySpy;
        expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    });

    // TODO: add more tests!
});
