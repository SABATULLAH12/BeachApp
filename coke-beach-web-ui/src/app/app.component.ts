import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ProfileType } from './Constants/ProfileType';
import { LeftPanelService } from './Services/left-panel.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'BEACH';
  isIframe = false;
  profile!: ProfileType;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();
  UserData={
    "UserName":"",
    "EmailID":""
  }

  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private broadcastService: MsalBroadcastService,
    private authService: MsalService,
    private leftPanelService: LeftPanelService,
    private http: HttpClient) { }

  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;

    this.broadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        this.getProfile(); // This function call will trigger login redirect on landing
      })
  }

  login() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }

  logout() { // Add log out function here
    this.authService.logoutRedirect({
      postLogoutRedirectUri: environment.redirectUri
    });
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  getProfile() {
    this.http.get('https://graph.microsoft.com/v1.0/me')
      .subscribe(profile => {
        this.profile = profile;
        if(this.profile.givenName===null){
          let k = this.profile.mail.indexOf("@");
         let name= this.profile.mail.substring(0,k);
          this.UserData.UserName=name;
        }
        else{
          this.UserData.UserName=this.profile.givenName;
        }
       
        this.UserData.EmailID=this.profile.mail;
        this.profile.isLoggedIn = true;
        // console.log(this.profile);
        if(this.loginDisplay){
          this.leftPanelService.AddUser(this.UserData).subscribe((data :any)=>{})
        }
      });


  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
