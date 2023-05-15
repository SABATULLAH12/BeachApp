import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from "rxjs";
import * as fileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
})
export class DataProviderService {
  geographySelectionObj: any = {};
  benchmarkSelectionObj: any = {};
  comparisonSelectionObj: any = [];
  filterSelectionObj: any = [];
  timeperiodSelected: any = {};

  resetSelectionObj: any = {

    'GEOGRAPHY': ['Timeperiod',],

    'TIMEPERIOD': ['Benchmark'],

    'BENCHMARK': ['Comparison'],

    'COMPARISON': ['Filter'],

  }
  
  leftPanelLoaded:boolean=false;

  leftPanelLoadedSelection = new BehaviorSubject<boolean>(this.leftPanelLoaded);


  getLeftPanelLoaded():Observable<boolean>{
    return this.leftPanelLoadedSelection.asObservable();
  }

  setLeftPanelLoaded(flag:boolean){
    this.leftPanelLoadedSelection.next(flag);
  }

  sampleSizePopup:boolean=false;
  sampleSizePopupSelection = new BehaviorSubject<any>(this.sampleSizePopup);

  getSampleSizePopupValue():Observable<boolean>{
    return this.sampleSizePopupSelection.asObservable();
  }

  setSampleSizePopupValue(flag:boolean){
    this.sampleSizePopupSelection.next(flag);
  }

  geographySelection = new BehaviorSubject<any>(this.geographySelectionObj);
  benchmarkSelection = new BehaviorSubject<any>(this.benchmarkSelectionObj);
  comparisonSelection = new BehaviorSubject<any[]>(this.comparisonSelectionObj);
  filterSelection = new BehaviorSubject<any[]>(this.filterSelectionObj);
  timeperiodSelection = new BehaviorSubject<any>(this.timeperiodSelected);

  getGeographySelection(): Observable<any> {
    return this.geographySelection.asObservable();
  }
  setGeographySelection(geography: any) {
    this.geographySelection.next(geography);
  }

  getBenchmarkSelection(): Observable<any> {
    return this.benchmarkSelection.asObservable();
  }
  setBenchmarkSelection(benchmark: any) {
    this.benchmarkSelection.next(benchmark);
  }

  getComparisonSelection(): Observable<any[]> {
    return this.comparisonSelection.asObservable();
  }
  setComparisonSelection(comparison: any[]) {
    this.comparisonSelection.next(comparison);
  }

  getFilterSelection(): Observable<any[]> {
    return this.filterSelection.asObservable();
  }
  setFilterSelection(filter: any[]) {
    this.filterSelection.next(filter);
  }

  getTimeperiodSelection(): Observable<any> {
    return this.timeperiodSelection.asObservable();
  }
  setTimeperiodSelection(timeperiod: any) {
    this.timeperiodSelection.next(timeperiod);
  }

  constructor() { }

  setGeoData(geoSelectionObj: any): void {
    this.geographySelectionObj = { ...geoSelectionObj };
    this.setGeographySelection(this.geographySelectionObj);
    //this.resetSelectionOnChange("GEOGRAPHY");
    this.resetAllSelection();
  }

  setBenchmarkData(benchmarkSelectionObj: any): void {
    this.benchmarkSelectionObj = { ...benchmarkSelectionObj };
    this.setBenchmarkSelection(this.benchmarkSelectionObj);
    this.resetSelectionOnChange("BENCHMARK");
  }

  setComparisonData(comparisonSelectionObj: any[]): void {
    this.comparisonSelectionObj = JSON.parse(
      JSON.stringify(comparisonSelectionObj)
    );
    this.setComparisonSelection(this.comparisonSelectionObj);
    //this.resetSelectionOnChange("COMPARISON");
  }

  setFilterData(filterSelectionObj: any): void {
    this.filterSelectionObj = JSON.parse(JSON.stringify(filterSelectionObj));
    this.setFilterSelection(this.filterSelectionObj);
  }

  setTimeperiodData(timeperiodSelection: any): void {
    this.timeperiodSelected = JSON.parse(JSON.stringify(timeperiodSelection));
    this.setTimeperiodSelection(this.timeperiodSelected);
    //this.resetSelectionOnChange("TIMEPERIOD");
    this.resetTimeperiodAll();
  }

  getGeoData(): any {
    return this.geographySelectionObj;
  }

  getBenchmarkData(): any {
    return this.benchmarkSelectionObj;
  }

  getComparisonData(): any[] {
    return this.comparisonSelectionObj;
  }

  getFilterData(): any {
    return this.filterSelectionObj;
  }
  getTimeperiodData(): any {
    return this.timeperiodSelected;
  }
  getAllSelectionData(): any {
    return {
      geographyMenu: this.geographySelectionObj,
      benchmarkMenu: this.benchmarkSelectionObj,
      comparisonMenu: this.comparisonSelectionObj,
      filterMenu: this.filterSelectionObj,
      timeperiodMenu: this.timeperiodSelected
    };
  }
  resetSelectionOnChange(type: string): void {
    let items = this.resetSelectionObj[type];
    items.forEach(e => this.resetSelection(e));
  }
  resetSelection(type: string): void {
    switch (type.toUpperCase()) {
      // case "GEOGRAPHY":this.resetGeography();break;
      case "TIMEPERIOD": this.resetTimeperiod(); break;
      case "BENCHMARK": this.resetBenchmark(); break;
      case "COMPARISON": this.resetComparison(); break;
      case "FILTER": this.resetFilter(); break;
    }
  }

  resetTimeperiod(): void {
    // this.geographySelectionObj={};
    this.setTimeperiodData({});
    localStorage.removeItem("TIMEPERIOD_SELECTION_DATA");
  }
  resetBenchmark(): void {
    this.setBenchmarkData({});
    localStorage.removeItem("BENCHMARK_SELECTION_DATA");
  }
  resetComparison(): void {
    this.setComparisonData([]);
    localStorage.removeItem("COMPARISON_SELECTION_DATA");
  }
  resetFilter(): void {
    this.setFilterData([]);
    localStorage.removeItem("FILTER_SELECTION_DATA");
  }

  clearChildOpenedAtt(data: any[]) {
    data.forEach(e => e.isChildOpened = false);
  }

  clearActiveItemAtt(data: any[]) {
    data.forEach(e => e.isSelected = false);
  }

  checkLevelOpenedClassNeeded(item: any): boolean {
    if (item.isSelected == true) {
      return false;
    }
    else if (item.isChildOpened == true) {
      return true;
    }
    return false;
  }

  resetAllSelection():void{
    this.resetTimeperiod();
    this.resetBenchmark();
    this.resetComparison();
    this.resetFilter();
  }
  resetTimeperiodAll():void{
    this.resetBenchmark();
    this.resetComparison();
    this.resetFilter();
  }

  ExportToExcelAllDetails(json: any[]): void {
    
    let newJson =[];
    for(let i=0;i<json.length;i++){
      let obj = Object.keys(json[i]);
      let objNew = {};
      objNew["Sr. No."]=i+1;
      for(let j=1;j<obj.length;j++){
        objNew[obj[j]]=json[i][obj[j]];
        objNew['Name'] = objNew['name'];
        objNew['Email ID'] = objNew['emailId'];
        objNew['Role'] = objNew['role'];
        objNew['Download Date'] = objNew['downloadDate'];
        objNew['Geography'] = objNew['geography'];
        objNew['Time Period'] = objNew['timePeriod'];
        objNew['Benchmark'] = objNew['benchmark'];
        objNew['Comparison'] = objNew['comparison'];
        objNew['Filters'] = objNew['filter'];
      }
      delete objNew['name'];
      delete objNew['emailId'];
      delete objNew['role'];
      delete objNew['downloadDate'];
      delete objNew['geography'];
      delete objNew['timePeriod'];
      delete objNew['benchmark'];
      delete objNew['comparison'];
      delete objNew['filter'];
      newJson.push(objNew);
    }
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newJson);
    const workbook: XLSX.WorkBook = { Sheets: { 'User_data': worksheet }, SheetNames: ['User_data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer,'UserDetails-');
  }

  ExportToExcelFile(json: any[]): void {
    
    let newJson =[];
    for(let i=0;i<json.length;i++){
      let obj = Object.keys(json[i]);
      let objNew = {};
      objNew["Sr. No."]=i+1;
      for(let j=1;j<obj.length;j++){
        objNew[obj[j]]=json[i][obj[j]];
        objNew['Name'] = objNew['name'];
        objNew['Email ID'] = objNew['emailId'];
        objNew['Date Added'] = objNew['date'];
        objNew['Role'] = objNew['role'];
      }
      delete objNew['name'];
      delete objNew['emailId'];
      delete objNew['date'];
      delete objNew['role'];
      newJson.push(objNew);
    }
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newJson);
    const workbook: XLSX.WorkBook = { Sheets: { 'User_data': worksheet }, SheetNames: ['User_data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer,'UserDetails-');
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    fileSaver.saveAs(data, fileName+currentDate+EXCEL_EXTENSION);
  }

}
