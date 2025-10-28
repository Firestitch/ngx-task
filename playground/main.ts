import { enableProdMode, Injector, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { FS_API_REQUEST_INTERCEPTOR } from '@firestitch/api';
import { ApiInterceptorFactory } from './app/interceptors';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FsMessageModule } from '@firestitch/message';
import { FsFileModule } from '@firestitch/file';
import { FsFilterModule } from '@firestitch/filter';
import { FsExampleModule } from '@firestitch/example';
import { FsDatePickerModule } from '@firestitch/datepicker';
import { provideRouter, Routes } from '@angular/router';
import { ExamplesComponent } from './app/components';
import { FsHtmlEditorModule } from '@firestitch/html-editor';
import { FsTabsModule } from '@firestitch/tabs';
import { FsTasksModule } from '../src/app/modules/tasks.module';
import { FsTaskModule } from '../src/app/modules/task.module';
import { AppComponent } from './app/app.component';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];



if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, FsMessageModule.forRoot(), FsFileModule.forRoot(), FsFilterModule.forRoot(), FsExampleModule.forRoot(), FsDatePickerModule.forRoot(), FsHtmlEditorModule.forRoot({
            activationKey: '2J1B10dD7F6F5A3F3I3cWHNGGDTCWHId1Eb1Oc1Yh1b2Ld1POkE3D3F3C9A4E5A3G3B2G2==',
        }), FsTabsModule.forRoot(), FsTasksModule.forRoot({
            subjectObject: {
                label: 'Subject',
            },
        }), FsTaskModule.forRoot({
            subjectObject: {
                label: 'Subject',
            },
        })),
        {
            provide: FS_API_REQUEST_INTERCEPTOR,
            useFactory: ApiInterceptorFactory,
            deps: [Injector],
        },
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'outline',
            },
        },
        provideAnimations(),
        provideRouter(routes),
    ]
})
  .catch((err) => console.error(err));

