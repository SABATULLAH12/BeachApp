import { Component, Input, OnInit, Output,EventEmitter } from "@angular/core";
import { DataProviderService } from "src/app/Services/data-provider.service";
@Component({
  selector: 'app-top-panel',
  templateUrl: './top-panel.component.html',
  styleUrls: ['./top-panel.component.scss']
})
export class TopPanelComponent implements OnInit{
geographyData:any=null;
timeperiodData:any=null;
benchmarkData:any=null;
comparisonData:any=[];
filterData:any=[];

@Output() closeLeftPopup = new EventEmitter<string>();


constructor(private dataProvider:DataProviderService){

}
ngOnInit(): void {
  this.dataProvider.getGeographySelection().subscribe((e)=>{
    this.geographyData = e;
  })
  this.dataProvider.getBenchmarkSelection().subscribe((e)=>{
    this.benchmarkData = e;
  })
  this.dataProvider.getComparisonSelection().subscribe((e)=>{
    this.comparisonData=e;
  })
  this.dataProvider.getTimeperiodSelection().subscribe((e)=>{
    this.timeperiodData=e;
  })
  this.dataProvider.getFilterSelection().subscribe((e)=>{
    this.filterData=e;
  })
  // console.log(this.geographyData);
  // console.log(this.timeperiodData);
  // console.log(this.benchmarkData);
  // console.log(this.comparisonData);
}
ngOnChange():void{
  // console.log(this.geographyData);
  // console.log(this.timeperiodData);
  // console.log(this.benchmarkData);
  // console.log(this.comparisonData);
}
delete_geo_selection(id:string){
  this.dataProvider.setGeoData({});
  this.closeLeftPopup.emit(id)
}

delete_timeperiod_selection(id:string){
  this.dataProvider.setTimeperiodData({});
  this.closeLeftPopup.emit(id)
}

delete_benchmark_selection(id:string){
  this.dataProvider.setBenchmarkData({});
  this.closeLeftPopup.emit(id)
}

delete_comparison_selection(id:string){
  let tempArr = JSON.parse(JSON.stringify(this.dataProvider.getComparisonData()));
  tempArr.splice(parseInt(id),1);
  this.dataProvider.setComparisonData(tempArr);
  this.closeLeftPopup.emit(id)
}

delete_filter_selection(id:string){
  let TempArr=JSON.parse(JSON.stringify(this.dataProvider.getFilterData()));
  TempArr.splice(parseInt(id),1);
  this.dataProvider.setFilterData(TempArr);
  this.closeLeftPopup.emit(id)
  // console.log(this.dataProvider.getFilterData(),id);
  // this.closeLeftPopup.emit(id)
}

}
