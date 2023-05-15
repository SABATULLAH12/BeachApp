import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { DataProviderService } from 'src/app/Services/data-provider.service';
import { LeftPanelService } from 'src/app/Services/left-panel.service';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.css']
})
export class UserStatsComponent implements OnInit {

  UserDataReportCount:any[];
  UserDataReportDetails:any[];
  MainUserDataReportCount:any[];
  MainUserDataReportDetails:any[];
  searchtext:any;
  order:boolean=true;
  IsExportEnable:boolean=true;
  RoleID:string='';
  TimePeriodID:any='';
  getcountparameter={
    "roleid":'',
    "timeperiodid":2
  }

  constructor(private leftPanelService:LeftPanelService,private dataprovider :DataProviderService) { }
  ngOnInit(): void {
  this.leftPanelService.GetCountReportCount(this.RoleID,this.TimePeriodID).subscribe((res) => {
    this.UserDataReportCount=res;
    // console.log(this.UserDataReportCount);
    this.MainUserDataReportCount=this.UserDataReportCount;
  })
  this.leftPanelService.GetReportDetails(this.RoleID,this.TimePeriodID).subscribe((res) => {
    this.UserDataReportDetails=res;
    this.UserDataReportDetails.forEach(x=>{
      x.downloadDate = x.downloadDate.slice(0, x.downloadDate.indexOf(' '));
    })
    this.MainUserDataReportDetails=this.UserDataReportDetails;
  })
  }
 
  
 
  FilterData(filterby:any){

    if(filterby.trim().length==0){
      this.MainUserDataReportCount=JSON.parse(JSON.stringify(this.UserDataReportCount));
      this.MainUserDataReportDetails=JSON.parse(JSON.stringify(this.UserDataReportDetails));
      this.IsExportEnable=true;
      return;
    }
    filterby = filterby.toLocaleLowerCase();
    this.MainUserDataReportCount=JSON.parse(JSON.stringify(this.UserDataReportCount));
    this.MainUserDataReportDetails=JSON.parse(JSON.stringify(this.UserDataReportDetails));
    this.MainUserDataReportCount=this.MainUserDataReportCount.filter((val) =>
      val.name.toLowerCase().includes(filterby)||val.emailId.toLowerCase().includes(filterby)
    );
    this.MainUserDataReportDetails=this.MainUserDataReportDetails.filter((val) =>
    val.name.toLowerCase().includes(filterby)||val.emailId.toLowerCase().includes(filterby)
  );
    if(this.MainUserDataReportDetails.length==0){
      this.IsExportEnable=false;
    }
    else{
      this.IsExportEnable=true;
    }
  }
  Datasorting(ColumnName:any){
    
    switch (ColumnName) {

      case 'name':
        if(this.order){
          this.MainUserDataReportCount=this.MainUserDataReportCount.sort((a,b)=>
          a.name.localeCompare(b.name));
          this.MainUserDataReportDetails=this.MainUserDataReportDetails.sort((a,b)=>
          a.name.localeCompare(b.name));
        }
        
          else{
            this.MainUserDataReportCount=this.MainUserDataReportCount.sort((a,b)=>
            b.name.localeCompare(a.name));
            this.MainUserDataReportDetails=this.MainUserDataReportDetails.sort((a,b)=>
            b.name.localeCompare(a.name));
            
         }
          this.order=!this.order;
          break;

      case 'email':
        if(this.order){
          this.MainUserDataReportCount=this.MainUserDataReportCount.sort((a,b)=>
           a.emailId.localeCompare(b.emailId));
           this.MainUserDataReportDetails=this.MainUserDataReportDetails.sort((a,b)=>
           a.emailId.localeCompare(b.emailId));
        }
        
          else{
            this.MainUserDataReportCount=this.MainUserDataReportCount.sort((a,b)=>
            b.emailId.localeCompare(a.emailId));
            this.MainUserDataReportDetails=this.MainUserDataReportDetails.sort((a,b)=>
              b.emailId.localeCompare(a.emailId));
         }
          this.order=!this.order;
          break;

      case 'role':
        if(this.order){
          this.MainUserDataReportCount=this.MainUserDataReportCount.sort((a,b)=>
           a.role.localeCompare(b.role));
           this.MainUserDataReportDetails=this.MainUserDataReportDetails.sort((a,b)=>
           a.role.localeCompare(b.role));
        }
        
          else{
            this.MainUserDataReportCount=this.MainUserDataReportCount.sort((a,b)=>
          b.role.localeCompare(a.role));
          this.MainUserDataReportDetails=this.MainUserDataReportDetails.sort((a,b)=>
          a.role.localeCompare(b.role));
            
         }
          this.order=!this.order;
          break;

          case 'NoOfReport':
        if(this.order){
          this.MainUserDataReportCount=this.MainUserDataReportCount.sort((a,b)=>{
          return a.reportDownloadCount-b.reportDownloadCount});
        }
        
          else{
            this.MainUserDataReportCount=this.MainUserDataReportCount.sort((a,b)=>{
            return b.reportDownloadCount-a.reportDownloadCount});
            
         }
          this.order=!this.order;
          break;
  }
  
 
}
  Reset(){
    this.ngOnInit();
  }
  exportToExcel() {
    this.dataprovider.ExportToExcelAllDetails(this.MainUserDataReportDetails);
  }

  SubmitData(rolid:string,timeperiodid:any){
  
    this.leftPanelService.GetCountReportCount(rolid,timeperiodid).subscribe((res) => {
      this.UserDataReportCount=res;
      this.MainUserDataReportCount=this.UserDataReportCount;
    })
    this.leftPanelService.GetReportDetails(rolid,timeperiodid).subscribe((res) => {
      this.UserDataReportDetails=res;
      this.MainUserDataReportDetails=this.UserDataReportDetails;
      if(this.MainUserDataReportDetails.length==0){
        this.IsExportEnable=false;
      }
      else{
        this.IsExportEnable=true;
      }
    })
    
  }
}
