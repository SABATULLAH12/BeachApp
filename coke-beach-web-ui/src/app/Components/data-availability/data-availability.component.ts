import { Component, OnInit } from '@angular/core';
import { LeftPanelService } from 'src/app/Services/left-panel.service';

@Component({
  selector: 'app-data-availability',
  templateUrl: './data-availability.component.html',
  styleUrls: ['./data-availability.component.css']
})
export class DataAvailabilityComponent implements OnInit {

  PopupVisible:boolean=false;
   DataTable:any[];
  //  LatestMonth:string="";

  constructor(private LeftPanelService :LeftPanelService) { }
  ngOnInit(): void {
    this.LeftPanelService.GetDataAvailability().subscribe((res)=>{
      this.DataTable=res.table;
      let data = JSON.parse(JSON.stringify(this.DataTable));
      let maxMonth = Math.max(...data.map(e=>e.max_Month_ID));
      this.DataTable = this.DataTable.map(e=>{e.latestMonth=this.GetLatestMonthAndYear(e.max_Month_ID);return e});
      // this.LatestMonth = this.GetLatestMonthAndYear(maxMonth);
      
    })
   
  }
 
  GetLatestMonthAndYear(monthYear:number):string
{
  let text="";
  let year = monthYear.toString().substring(0,4);
  let month = this.GetMonth(monthYear.toString().substring(4,6));
  text = month+" "+year;
  return text;
}
GetMonth(month:string):string{
 switch(month){
  case "01":return "JAN";break;
  case "02":return "FEB";break;
  case "03":return "MAR";break;
  case "04":return "APR";break;
  case "05":return "MAY";break;
  case "06":return "JUN";break;
  case "07":return "JUL";break;
  case "08":return "AUG";break;
  case "09":return "SEP";break;
  case "10":return "OCT";break;
  case "11":return "NOV";break;
  case "12":return "DEC";break;
  default: return "Invalid"
  }
}

  OpenPopup(){
    this.PopupVisible=true;
  }
  ClosePopup(){
    this.PopupVisible=false;
  }
}
