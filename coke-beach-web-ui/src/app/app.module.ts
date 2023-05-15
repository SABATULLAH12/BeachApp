import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { HomeComponent } from './Components/home/home.component';
import { LeftPanelComponent } from './Components/left-panel/left-panel.component';
import { GeographyLeftPanelComponent } from './Components/geography-left-panel/geography-left-panel.component';
import { BenchmarkLeftPanelComponent } from './Components/benchmark-left-panel/benchmark-left-panel.component';
import { TimePeriodLeftPanelComponent } from './Components/time-period-left-panel/time-period-left-panel.component';
import { ComparisonLeftPanelComponent } from './Components/comparison-left-panel/comparison-left-panel.component';
import { FilterLeftPanelComponent } from './Components/filter-left-panel/filter-left-panel.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TopPanelComponent } from './Components/top-panel/top-panel.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { CacheInterceptor } from './Services/Interceptor/cache.interceptor';
import { CustomPopupComponent } from './Components/custom-popup/custom-popup.component';
import { SamplesizePopupComponent } from './Components/samplesize-popup/samplesize-popup.component';
import { environment } from 'src/environments/environment';
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { UserManagementComponent } from './Components/user-management/user-management.component';
import { UserStatsComponent } from './Components/user-stats/user-stats.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DataAvailabilityComponent } from './Components/data-availability/data-availability.component';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LeftPanelComponent,
    GeographyLeftPanelComponent,
    BenchmarkLeftPanelComponent,
    TimePeriodLeftPanelComponent,
    ComparisonLeftPanelComponent,
    FilterLeftPanelComponent,
    TopPanelComponent,
    CustomPopupComponent,
    SamplesizePopupComponent,
    UserManagementComponent,
    UserStatsComponent,
    DataAvailabilityComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxSliderModule,
    HttpClientModule,ReactiveFormsModule,FormsModule,
    MsalModule.forRoot(new PublicClientApplication({
      auth: {
        clientId: environment.clientId,
        authority: `${environment.authority}/${environment.tenantId}`,
        redirectUri: environment.redirectUri,
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE,
      }
    }), {
      interactionType: InteractionType.Redirect,
      authRequest: {
        scopes: ['user.read']
      }
    }, {
      interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
      protectedResourceMap: new Map([
        ['https://graph.microsoft.com/v1.0/me', ['user.read']]
      ])
    })
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalGuard
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
