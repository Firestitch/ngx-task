import { Injector, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';


import { FsActivitiesComponent, FsActivityDataDirective, FsActivityObjectDirective } from '@firestitch/activity';
import { FS_API_REQUEST_INTERCEPTOR } from '@firestitch/api';
import { FsExampleModule } from '@firestitch/example';
import { FsHtmlEditorModule } from '@firestitch/html-editor';
import { FsMessageModule } from '@firestitch/message';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import {
  ActivitiesComponent,
  ExamplesComponent,
} from './components';
import { ApiInterceptorFactory } from './interceptors';


const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FsMessageModule.forRoot(),
    FsExampleModule.forRoot(),
    RouterModule.forRoot(routes),
    FsHtmlEditorModule.forRoot({
      activationKey: '2J1B10dD7F6F5A3F3I3cWHNGGDTCWHId1Eb1Oc1Yh1b2Ld1POkE3D3F3C9A4E5A3G3B2G2==',
    }),
    FsActivitiesComponent,
    FsActivityObjectDirective,
    FsActivityDataDirective,
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    ActivitiesComponent,
  ],
  providers: [
    {
      provide: FS_API_REQUEST_INTERCEPTOR,
      useFactory: ApiInterceptorFactory,
      deps: [Injector],
    },
  ],
})
export class PlaygroundModule {
}
