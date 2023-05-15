import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChangeContext, Options } from "@angular-slider/ngx-slider";
import { DataProviderService } from 'src/app/Services/data-provider.service';

@Component({
  selector: 'app-time-period-left-panel',
  templateUrl: './time-period-left-panel.component.html',
  styleUrls: ['./time-period-left-panel.component.scss']
})
export class TimePeriodLeftPanelComponent implements OnInit {
  @Input() timePeriodArray: any[] = []
  @Input() geographyId: string = ""
  value: number = 5;
  activeTimeperiodType: string = "12MMT"
  arr = [{ id: 1, text: "12MMT JAN 2022", type: "12MMT", isShow: false },]
  disabledList = {"12MMT":false,"3MMT":false,"YTD":false,"YEAR":false}
  timeArray = [
    { id: 1, text: "12MMT JAN 2022", type: "12MMT", isShow: false }, { id: 2, text: "12MMT FEB 2022", type: "12MMT", isShow: false }, { id: 3, text: "12MMT MAR 2022", type: "12MMT", isShow: false }, { id: 4, text: "12MMT APR 2022", type: "12MMT", isShow: false },
    { id: 5, text: "3MMT JAN 2022", type: "3MMT", isShow: false }, { id: 6, text: "3MMT FEB 2022", type: "3MMT", isShow: false }, { id: 7, text: "3MMT MAR 2022", type: "3MMT", isShow: false }, { id: 8, text: "3MMT APR 2022", type: "3MMT", isShow: false },
    { id: 9, text: "YTD JAN 2022", type: "YTD", isShow: false }, { id: 10, text: "YTD FEB 2022", type: "YTD", isShow: false }, { id: 11, text: "YTD MAR 2022", type: "YTD", isShow: false }, { id: 12, text: "YTD APR 2022", type: "YTD", isShow: false },
    { id: 13, text: "2019", type: "YEAR", isShow: false }, { id: 14, text: "2020", type: "YEAR", isShow: false }, { id: 15, text: "2021", type: "YEAR", isShow: false }, { id: 16, text: "2022", type: "YEAR", isShow: false },
  ]
  options: Options = {
    floor: 0,
    ceil: this.arr.length - 1,
    step: 1
  };

  constructor(private dataProvider: DataProviderService) {
  }

  ngOnInit(): void {
    this.getTimePeriodData();
  }

  pointerChangeStart(change: ChangeContext) {
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
    if(this.arr.length==1){
      this.arr[0].isShow = true;
    }
    else{
      this.arr[change.value].isShow = true;
    }
  }

  pointerChangeEnd(change: ChangeContext) {
    if(this.arr.length==1){
      this.arr[0].isShow = true;
    this.dataProvider.setTimeperiodData(this.arr[0]);
    localStorage.setItem("TIMEPERIOD_SELECTION_DATA", JSON.stringify(this.arr[0]));
    }
    else{
      this.arr[change.value].isShow = true;
    this.dataProvider.setTimeperiodData(this.arr[change.value]);
    localStorage.setItem("TIMEPERIOD_SELECTION_DATA", JSON.stringify(this.arr[change.value]));
    }
  }

  renderTimeperiod(type: string) {
    this.arr = JSON.parse(JSON.stringify(this.timeArray.filter(e => e.type.toUpperCase() == type.toUpperCase())));
    this.activeTimeperiodType = type;
    if(this.arr.length==1){
      this.value = 1;
      this.options = { floor: 0, ceil: 1, step: 1, minLimit:1 }
      this.dataProvider.setTimeperiodData(this.arr[this.value-1]);
      localStorage.setItem("TIMEPERIOD_SELECTION_DATA", JSON.stringify(this.arr[this.value-1]));
    }
    else{
      this.value = this.arr.length - 1;
      this.options = { floor: 0, ceil: this.arr.length - 1, step: 1 }
      this.dataProvider.setTimeperiodData(this.arr[this.value]);
      localStorage.setItem("TIMEPERIOD_SELECTION_DATA", JSON.stringify(this.arr[this.value]));
    }
  }

  getTimePeriodData(): void {
    const geoObj = this.dataProvider.getGeoData();
    this.geographyId = geoObj.geographyId;
    this.timeArray = this.timePeriodArray;
    this.disabledList = {"12MMT":false,"3MMT":false,"YTD":false,"YEAR":false};
    let timePeriodArr:any[] = JSON.parse(JSON.stringify(this.timeArray.filter(e => e.type.toUpperCase() == "12MMT")));
    if(timePeriodArr.length==0){
      this.disabledList['12MMT']=true;
    }
    timePeriodArr =  JSON.parse(JSON.stringify(this.timeArray.filter(e => e.type.toUpperCase() == "3MMT")));
    if(timePeriodArr.length==0){
      this.disabledList['3MMT']=true;
    }
    timePeriodArr =  JSON.parse(JSON.stringify(this.timeArray.filter(e => e.type.toUpperCase() == "YTD")));
    if(timePeriodArr.length==0){
      this.disabledList['YTD']=true;
    }
    timePeriodArr =  JSON.parse(JSON.stringify(this.timeArray.filter(e => e.type.toUpperCase() == "YEAR")));
    if(timePeriodArr.length==0){
      this.disabledList['YEAR']=true;
    }
    if (this.timeArray.length != 0) {
      this.renderTimeperiod("3MMT");
    }
  }

  GetLeftPositionValue(index: any, length: any) {
    if (length != 1) {
      return ((index * 100) / (length - 1))
    }
    else {
      return 100;
    }
  }
}
