import { Component, OnInit, ViewChild } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { DataProviderService } from 'src/app/Services/data-provider.service';
import { environment } from 'src/environments/environment';
import { LeftPanelComponent } from '../left-panel/left-panel.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isOpactiyApplied: boolean = false;
  isLeftPanelDataLoaded: boolean = false;
  loginDisplay = false;
  VideoLink: string =environment.videolink;

  constructor(private dataProvider: DataProviderService, private authService: MsalService, private msalBroadcastService: MsalBroadcastService) { }

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      )
      .subscribe((result: EventMessage) => {
        // console.log(result);
      });
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        this.checkUMAccess();
      })
    this.dataProvider.getLeftPanelLoaded().subscribe(e => this.isLeftPanelDataLoaded = e);
  }

  toggleOpacity(data): void {
    this.isOpactiyApplied = data;
  }

  @ViewChild(LeftPanelComponent) child: LeftPanelComponent;
  closepopup() {
    this.child.CloseAllPopup();
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }
  checkUMAccess(){
    if(this.child!=undefined)
    this.child.GetProfile();
   }
}
