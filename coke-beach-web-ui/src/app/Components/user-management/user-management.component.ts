import { ChangeContext, Options } from '@angular-slider/ngx-slider';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { ProfileType } from 'src/app/Constants/ProfileType';
import { DataProviderService } from 'src/app/Services/data-provider.service';
import { LeftPanelService } from 'src/app/Services/left-panel.service';
import { environment } from 'src/environments/environment';
import { UserStatsComponent } from '../user-stats/user-stats.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  @ViewChild(UserStatsComponent) child: UserStatsComponent;
  profile!: ProfileType;
  UserData: any[];
  UserDataTable: any[];
  LeftPanelData: any[];
  UserID: any;
  EditUserEmail: any;
  order: boolean = true;
  User_Stats: boolean = false;
  Manage_User: boolean = true;
  TimePeriodID: any;
  RoleID: string = "";
  searchtext: any;
  IsExportEnable: boolean = true;
  IsAdminRoleSelect: boolean = false;
  IsBasicRoleSelect: boolean = false;
  IsTimeperiodSelectionActive: boolean = false;
  IsRoleSelectionActive: boolean = false;
  SelectedTimePeriodText: string;
  UpdatedUserData = {
    "EmailId": "",
    "Role": ""
  }


  TimePeriodSelection: boolean = false;
  constructor(private authService: MsalService, private leftPanelService: LeftPanelService, private dataprovider: DataProviderService, private http: HttpClient) { }
  ngOnInit(): void {
    this.GetProfile();
    this.leftPanelService.GetUserData().subscribe((res) => {
      this.UserDataTable = res;
      this.UserDataTable.forEach(x=>{
        x.date = x.date.slice(0, x.date.indexOf(' '));
      })
      this.UserData = this.UserDataTable;
    })
    this.getTimePeriodData();
  }
  GetProfile() {
    this.http.get('https://graph.microsoft.com/v1.0/me')
      .subscribe(profile => {
        this.profile = profile;
      });
  }
  Logout() {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: environment.redirectUri
    });
  }
  EditRole(EmailID: any) {
    if (this.EditUserEmail === '') {
      this.EditUserEmail = EmailID;
    } else {
      this.EditUserEmail = '';
    }
  }
  closeEditPopUp(event: any) {
    if (event.target.className === 'Table_Data_Container') {
      this.EditUserEmail = '';
    }
  }
  FilterData(filterby: any) {

    if (filterby.trim().length == 0) {
      this.UserData = JSON.parse(JSON.stringify(this.UserDataTable));
      this.IsExportEnable = true;
      return;
    }
    filterby = filterby.toLocaleLowerCase();
    this.UserData = JSON.parse(JSON.stringify(this.UserDataTable));
    this.UserData = this.UserData.filter((val) =>
      val.name.toLowerCase().includes(filterby) || val.emailId.toLowerCase().includes(filterby)
    );
    if (this.UserData.length == 0) {
      this.IsExportEnable = false;
    }
    else {
      this.IsExportEnable = true;
    }
  }
  Reset(){
    this.child.Reset();
    this.getTimePeriodData();
    this.IsAdminRoleSelect = false;
    this.IsBasicRoleSelect = false;
    this.RoleID = "";

  }
  UpdateUserRole(role:any){
    this.UpdatedUserData.Role=role;
    this.UpdatedUserData.EmailId=this.EditUserEmail;
    this.leftPanelService.UpdateUserRole(this.UpdatedUserData).subscribe((data :any)=>{
     this.ngOnInit();
    })
    this.EditUserEmail = '';
  }


  Datasorting(ColumnName: any) {

    switch (ColumnName) {

      case 'name':
        if (this.order) {
          this.UserData = this.UserData.sort((a, b) => {
            return a.name.localeCompare(b.name)
          });
        }

        else {
          this.UserData = this.UserData.sort((a, b) => {
            return b.name.localeCompare(a.name)
          });

        }
        this.order = !this.order;
        break;
      case 'email':
        if (this.order) {
          this.UserData = this.UserData.sort((a, b) => {
            return a.emailId.localeCompare(b.emailId)
          });
        }

        else {
          this.UserData = this.UserData.sort((a, b) => {
            return b.emailId.localeCompare(a.emailId)
          });

        }
        this.order = !this.order;
        break;
      case 'date_Added':
        if (this.order) {
          this.UserData = this.UserData.sort((a, b) => {
            return a.date.localeCompare(b.date)
          });
        }

        else {
          this.UserData = this.UserData.sort((a, b) => {
            return b.date.localeCompare(a.date)
          });

        }
        this.order = !this.order;
        break;
      case 'role':
        if (this.order) {
          this.UserData = this.UserData.sort((a, b) => {
            return a.role.localeCompare(b.role)
          });
        }

        else {
          this.UserData = this.UserData.sort((a, b) => {
            return b.role.localeCompare(a.role)
          });

        }
        this.order = !this.order;
        break;
    }

  }
  exportToExcel() {
    this.dataprovider.ExportToExcelFile(this.UserData);
  }
  ManageUsers() {
    this.User_Stats = !this.User_Stats;
    this.Manage_User = !this.Manage_User;

  }
  UserStats() {
    this.Manage_User = !this.Manage_User;
    this.User_Stats = !this.User_Stats;
    this.IsTimeperiodSelectionActive = false;
    this.IsRoleSelectionActive = false;
    this.IsAdminRoleSelect = false;
    this.IsBasicRoleSelect = false;
    this.RoleID = "";
  }

  isTimePeriodActive() {
    this.IsTimeperiodSelectionActive = !this.IsTimeperiodSelectionActive;
  }
  isRoleActive() {
    this.IsRoleSelectionActive = !this.IsRoleSelectionActive;
  }

  GetRoleSelection(roleid: string) {
    if (roleid == "1") {
      this.IsBasicRoleSelect = false;
      this.IsAdminRoleSelect = !this.IsAdminRoleSelect;
      if (this.IsAdminRoleSelect) {
        this.RoleID = roleid;
      }
      else {
        this.RoleID = "";
      }
    }

    else {
      this.IsAdminRoleSelect = false;
      this.IsBasicRoleSelect = !this.IsBasicRoleSelect;
      if (this.IsBasicRoleSelect) {
        this.RoleID = roleid;
      }
      else {
        this.RoleID = "";
      }
    }
  }

  //time period

  roleArray = [{ id: 1, text: "Admin" }, { id: 2, text: "Basic" }]
  value: number = 5;
  activeTimeperiodType: string = "MONTH"
  arr = [{ id: 1, timeperiodtext: "JAN 2022", timeperiodtype: "MONTH", isShow: false }, { id: 2, tetimeperiodtext: "FEB 2022", timeperiodtype: "MONTH", isShow: false }, { id: 3, timeperiodtext: "MAR 2022", timeperiodtype: "MONTH", isShow: false }, { id: 4, timeperiodtext: "APR 2022", timeperiodtype: "MONTH", isShow: false },]
  disabledList = { "MONTH": false, "QUARTER": false, "YEAR": false }
  timeArray = [
    { id: 1, timeperiodtext: "JAN 2022", timeperiodtype: "MONTH", isShow: false }, { id: 1, timeperiodtext: "JAN 2022", timeperiodtype: "MONTH", isShow: false }, { id: 2, timeperiodtext: "FEB 2022", timeperiodtype: "MONTH", isShow: false }, { id: 3, timeperiodtext: "MAR 2022", timeperiodtype: "MONTH", isShow: false }, { id: 4, timeperiodtext: "APR 2022", timeperiodtype: "MONTH", isShow: false }
    //   { id: 5, text: "Q1 2022", type: "QUARTER", isShow: false }, { id: 6, text: "Q2 2022", type: "QUARTER", isShow: false }, { id: 7, text: "Q3 2022", type: "QUARTER", isShow: false }, { id: 8, text: "Q4 2022", type: "QUARTER", isShow: false },
    //   { id: 9, text: "2022", type: "YEAR", isShow: false }, { id: 10, text: "2023", type: "YEAR", isShow: false },
    // ]
  ]
  options: Options = {
    floor: 0,
    ceil: this.arr.length - 1,
    step: 1
  };
  pointerChangeStart


    (change: ChangeContext) {
    /*let el = document.getElementById("tipLabel"+change.value);
    if(el!=null)
    {
      el.style.opacity='1';
      el.style.visibility='visible';
    }*/
    // this.arr[change.value].isShow=true;
  }

  pointerChange(change: ChangeContext) {
    this.arr.forEach(e => e.isShow = false);
    if (this.arr.length == 1) {
      this.arr[0].isShow = true;
    }
    else {
      this.arr[change.value].isShow = true;
    }
  }

  pointerChangeEnd(change: ChangeContext) {
    if (this.arr.length == 1) {
      this.arr[0].isShow = true;
      this.TimePeriodID = this.arr[0].id;
      this.SelectedTimePeriodText = this.arr[0].timeperiodtext
        ;

    }
    else {
      this.arr[change.value].isShow = true;
      this.TimePeriodID = this.arr[change.value].id;
      this.SelectedTimePeriodText = this.arr[change.value].timeperiodtext
        ;
    }
  }

  renderTimeperiod(type: string) {
    this.arr = JSON.parse(JSON.stringify(this.timeArray.filter(e => e.timeperiodtype.toUpperCase() == type.toUpperCase())));
    this.activeTimeperiodType = type;
    if (this.arr.length == 1) {
      this.value = 1;
      this.options = { floor: 0, ceil: 1, step: 1, minLimit: 1 }
      this.TimePeriodID = this.arr[this.value - 1].id;
      this.SelectedTimePeriodText = this.arr[this.value - 1].timeperiodtext
        ;
    }
    else {
      this.value = this.arr.length - 1;
      this.options = { floor: 0, ceil: this.arr.length - 1, step: 1 }
      this.TimePeriodID = this.arr[this.value].id;
      this.SelectedTimePeriodText = this.arr[this.value].timeperiodtext
        ;
    }
  }


  getTimePeriodData(): void {
    this.leftPanelService.GetLeftPanelData().subscribe((res) => {
      this.timeArray = JSON.parse(JSON.stringify(res.table));
      for (let i = 0; i < this.timeArray.length; i++) {
        this.timeArray[i].isShow = false;
      }

      this.disabledList = { "MONTH": false, "QUARTER": false, "YEAR": false };
      let timePeriodArr: any[] = JSON.parse(JSON.stringify(this.timeArray.filter(e => e.timeperiodtype.toUpperCase() == "MONTH")));
      if (timePeriodArr.length == 0) {
        this.disabledList['MONTH'] = true;
      }
      timePeriodArr = JSON.parse(JSON.stringify(this.timeArray.filter(e => e.timeperiodtype.toUpperCase() == "QUARTER")));
      if (timePeriodArr.length == 0) {
        this.disabledList['QUARTER'] = true;
      }
      timePeriodArr = JSON.parse(JSON.stringify(this.timeArray.filter(e => e.timeperiodtype.toUpperCase() == "YEAR")));
      if (timePeriodArr.length == 0) {
        this.disabledList['YEAR'] = true;
      }
      if (this.timeArray.length != 0) {
        this.renderTimeperiod("MONTH");
      }
    });

  }

  GetLeftPositionValue(index: any, length: any) {
    if (length != 1) {
      return ((index * 100) / (length - 1))
    }
    else {
      return 100;
    }

  }

  SubmitData() {
    // alert("Tp"+this.TimePeriodID+" "+this.SelectedTimePeriodText+"RoleID-"+this.RoleID);
    this.child.SubmitData(this.RoleID, this.TimePeriodID);
    this.RoleID = "";
    this.IsAdminRoleSelect = false;
    this.IsBasicRoleSelect = false;
    this.IsTimeperiodSelectionActive = false;
    this.IsRoleSelectionActive = false;
  }

}
