import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HttpClient, provideHttpClient} from "@angular/common/http";
import {SnapComparisonViewComponent} from "./snap-comparison-view/snap-comparison-view.component";

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        SnapComparisonViewComponent,
    ],
  providers: [
    provideHttpClient(),],
  bootstrap: [AppComponent]
})
export class AppModule { }
