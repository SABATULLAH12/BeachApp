import { Component, Input, OnInit } from '@angular/core';
import { LIMIT_ERROR } from 'src/app/Constants/Constant';
import { DataProviderService } from 'src/app/Services/data-provider.service';
import { SwalNotificationService } from 'src/app/Services/swal-notification.service';

@Component({
  selector: 'app-comparison-left-panel',
  templateUrl: './comparison-left-panel.component.html',
  styleUrls: ['./comparison-left-panel.component.css']
})
export class ComparisonLeftPanelComponent implements OnInit {
  @Input() comparisonMenu: any = {};
  @Input() geographyId: string = '';
  levelOneData: any[] = [];
  levelTwoData: any[] = [];
  levelThreeData: any[] = [];
  levelFourData: any[] = [];
  levelFiveData: any[] = [];
  levelTwoFilteredData: any[] = [];
  levelThreeFilteredData: any[] = [];
  levelFourFilteredData: any[] = [];
  levelFiveFilteredData: any[] = [];
  isLevelTwoSelected: boolean = false;
  isLevelThreeSelected: boolean = false;
  isLevelFourSelected: boolean = false;
  isLevelFiveSelected: boolean = false;
  comparisonSelectionObj: any = [];
  isShowPopup:boolean=false;
  ErrorMsg:string="";
  searchText:string;
  isSearchList:boolean=false;
  filterData:any[]=[];
  isConsumptionAvailable:boolean=false;

  constructor(private notification: SwalNotificationService, private dataProvider: DataProviderService) { }

  ngOnInit(): void {
    this.getComparisonMenuData();
  }
  TogglePopup(data): void {

    this.isShowPopup = data;
  }
  ShowPopup(msg:any){
    this.isShowPopup=this.isShowPopup=true;
    this.ErrorMsg="";
    this.ErrorMsg=this.ErrorMsg=msg;

  }

  // Destructre different data level from the main benchmark object:
  getComparisonMenuData(): void {
    const { data } = this.comparisonMenu;
    const timeObj = this.dataProvider.getTimeperiodData();
    let timeperiodType = timeObj.type;
    const [level01, level02, level03, level04, level05] = data;
    this.levelOneData = level01.data;
    this.levelTwoData = level02.data;
    this.levelThreeData = level03.data;
    this.levelFourData = level04.data;
    this.levelFiveData = level05.data;

    if (timeperiodType.toUpperCase() != "12MMT" && timeperiodType.toUpperCase() != "YEAR") {
      this.isConsumptionAvailable=false;
      this.levelFourData.forEach(e => { e.hasChild = false; e.consumptionId = 1; e.consumptionName = "Observed Drinkers" });
    }
    else {
      this.isConsumptionAvailable=true;
      this.levelFourData.forEach(e => { e.hasChild = true; e.consumptionId = 1; e.consumptionName = "Observed Drinkers" });
    }
    this.levelOneData.forEach(e => { e.levelId = 1; e.isSelected = false; e.isChildOpened = false; });
    this.levelTwoData.forEach(e => { e.levelId = 2; e.isSelected = false; e.isChildOpened = false; });
    // this.levelThreeData.forEach(e => { e.levelId = 3; e.isSelected = false; e.isChildOpened = false; });
    // this.levelFourData.forEach(e => { e.levelId = 4; e.isSelected = false; e.isChildOpened = false; });
    this.levelThreeData.forEach(e=>{
      let item = this.levelTwoData.find(a=>a.id==e.parentId);
       e.detailedText = e.text+" ("+item.text+")";
       e.levelId = 3; e.isSelected = false; e.isChildOpened = false;
     });
     this.levelFourData.forEach(e=>{let item = this.levelTwoData.find(a=>a.id==e.parentId);
      e.detailedText = e.text+" ("+item.text+")";
      e.levelId = 4; e.isSelected = false; e.isChildOpened = false;})
    this.levelFiveData.forEach(e => { e.levelId = 5; e.isSelected = false; e.isChildOpened = false; });
    this.selectOrDeselectPreviousSelection(true);
  }

  // Function for opening next level menu:
  openNextLevelPopUp(id: number, levelId: number, text:string): void {
    if (levelId === 2) {
      this.isLevelTwoSelected = true;
      this.isLevelThreeSelected = false;
      this.isLevelFourSelected = false;
      this.isLevelFiveSelected = false;
      this.levelTwoFilteredData = this.levelTwoData.filter(x => x.parentId === id);
      this.dataProvider.clearChildOpenedAtt(this.levelOneData);
      this.dataProvider.clearChildOpenedAtt(this.levelTwoFilteredData);
      this.levelOneData.find(e => e.id == id).isChildOpened = true;
    } else if (levelId === 3) {
      this.isLevelThreeSelected = true;
      this.isLevelFourSelected = false;
      this.isLevelFiveSelected = false;
      this.levelThreeFilteredData = this.levelThreeData.filter(x => x.parentId === id)
      this.levelThreeFilteredData.map(x=>{x.detailedText=x.text+" ("+text+")";})
      this.levelFourFilteredData = this.levelFourData.filter(x => x.parentId === id)
      this.levelFourFilteredData.map(x=>{x.detailedText=x.text+" ("+text+")";})
      this.dataProvider.clearChildOpenedAtt(this.levelTwoFilteredData);
      this.dataProvider.clearChildOpenedAtt(this.levelFourFilteredData);
      this.levelTwoFilteredData.find(e => e.id == id).isChildOpened = true;
    }
    else {
      this.isLevelFiveSelected = true;
      this.levelFiveFilteredData = this.levelFiveData.filter(x => x.parentId === id);
      this.dataProvider.clearChildOpenedAtt(this.levelFourFilteredData);
      this.levelFourFilteredData.find(e => e.id == id).isChildOpened = true;
    }
  }

  // Function to get the selected data and store it in localstorage for building final data:
  getComparisonSelectionData(id: number, isSelectable: boolean, levelId: number, selectionType: string,fromSearch:boolean=false): void {
    let consumptionSelectionObj: any = {};
    let selectionObj: any = {};
    // if(fromSearch){
    //   this.searchText='';
    //   this.isSearchList=false;
    // }
    selectionType=selectionType.toUpperCase();
    let data = this.dataProvider.getComparisonData();
    if (data.length !== 0) {
      this.comparisonSelectionObj = JSON.parse(JSON.stringify(data));
    }
    if (isSelectable) {
      if (levelId === 1) {
        this.isLevelTwoSelected = false;
        this.isLevelThreeSelected = false;
        this.isLevelFourSelected = false;
        this.isLevelFiveSelected = false;
        selectionObj = this.levelOneData.find(x => x.id === id);
        this.dataProvider.clearChildOpenedAtt(this.levelOneData);
      }
      else if (levelId === 2) {
        this.isLevelThreeSelected = false;
        this.isLevelFourSelected = false;
        this.isLevelFiveSelected = false;
        selectionObj = fromSearch? this.levelTwoData.find(x => x.id === id) : this.levelTwoFilteredData.find(x => x.id === id);
        this.dataProvider.clearChildOpenedAtt(this.levelTwoFilteredData);
      }
      else if (levelId === 3) {
        this.isLevelFiveSelected = false;

        if(fromSearch){
          selectionObj = selectionType === 'TRADEMARK' ? this.levelThreeData.find(x => x.id === id) : this.levelFourData.find(x => x.id === id);
        }
        else{
          selectionObj = selectionType === 'TRADEMARK' ? this.levelThreeFilteredData.find(x => x.id === id) : this.levelFourFilteredData.find(x => x.id === id);
        }
        if (selectionType === 'BRAND') {
          this.dataProvider.clearChildOpenedAtt(this.levelFourFilteredData);
        }
      }
      else if (levelId === 4) {

        if(fromSearch){
          consumptionSelectionObj = this.levelFiveData.find(x => x.id === id);
          selectionObj = this.levelFourData.find(x => x.id === consumptionSelectionObj.parentId);
          /*this.levelFiveData.forEach(e => {
            if (e.id != id) {
              e.isSelected = false;
            }
          })*/
         }
         else{
          consumptionSelectionObj = this.levelFiveFilteredData.find(x => x.id === id);
          selectionObj = this.levelFourFilteredData.find(x => x.id === consumptionSelectionObj.parentId);
          /*this.levelFiveFilteredData.forEach(e => {
            if (e.id != id) {
              e.isSelected = false;
            }
          })*/
         }

        consumptionSelectionObj.isSelected = !consumptionSelectionObj.isSelected;
        /*let tempSelectionObj = { ...selectionObj };
        tempSelectionObj = {
          ...selectionObj,
          consumptionId: consumptionSelectionObj.metricId,
          consumptionName: consumptionSelectionObj.text,
          hasChild: consumptionSelectionObj.hasChild
        }
        selectionObj = { ...tempSelectionObj };*/
      }
      if (selectionType == 'BRAND') {
        let item = this.levelFourData.find(e => e.id == id);
        let consumptionId = item.consumptionId;
        this.levelFiveData.filter(e => e.parentId == item.id).forEach(e => {
          if (e.metricId == consumptionId) {
            e.isSelected = !e.isSelected;
          }
          else {
            e.isSelected = false;
          }
        })
      }
      //let same = levelId != 4 ? selectionObj.isSelected : (selectionObj.isSelected && selectionObj.consumptionId == consumptionSelectionObj.metricId);


      let same = false;
      if(levelId!=4){
        same = selectionObj.isSelected;
      }
      else{
        if(this.comparisonSelectionObj.some(x=>x.id===selectionObj.id && x.consumptionId == consumptionSelectionObj.metricId)===true){
          same=true;
        }
        else{
          same=false;
        }
      }

      if (levelId == 4) {
        selectionObj['consumptionId'] = consumptionSelectionObj.metricId;
        selectionObj['consumptionName'] = consumptionSelectionObj.text;
      }

      if (this.comparisonSelectionObj.length !== 6 || same == true) { // Maximum 6 selection allowed

        if(same){
          let index = -1;
          if(levelId!=4){
            index = this.comparisonSelectionObj.findIndex(x => x.id === selectionObj.id);
          }
          else{
            index = this.comparisonSelectionObj.findIndex(x=>x.id===selectionObj.id && x.consumptionId == consumptionSelectionObj.metricId)
          }
          //let index = this.comparisonSelectionObj.findIndex(x => x.id === selectionObj.id);
          selectionObj.isSelected = !same;
          this.comparisonSelectionObj.splice(index, 1);
      }
      else{
        selectionObj.isSelected = true;
        this.comparisonSelectionObj.push(selectionObj);
      }

        /*if (this.comparisonSelectionObj.some(x => x.id === selectionObj.id) === true) {

          if (same == true) {
            let index = this.comparisonSelectionObj.findIndex(x => x.id === selectionObj.id);
            selectionObj.isSelected = !same;
            this.comparisonSelectionObj.splice(index, 1);
          }
          else {
            let index = this.comparisonSelectionObj.findIndex(x => x.id === selectionObj.id);
            selectionObj.isSelected = !same;
            let item = this.comparisonSelectionObj[index];
            item.isSelected = selectionObj.isSelected;
            item.consumptionId = selectionObj.consumptionId;
            item.consumptionName = selectionObj.consumptionName;
          }


        }
        else {
          selectionObj.isSelected = true;
          this.comparisonSelectionObj.push(selectionObj);
        }*/
      }
      else {
        // this.notification.displayErrorMessage(LIMIT_ERROR);
        if(levelId==4){
          consumptionSelectionObj.isSelected=false;
        }
        this.ShowPopup(LIMIT_ERROR);
      }
      this.dataProvider.setComparisonData(this.comparisonSelectionObj);
      localStorage.setItem("COMPARISON_SELECTION_DATA", JSON.stringify(this.comparisonSelectionObj));
    }
  }

  checkActiveClass(item: any): boolean {
    return this.dataProvider.checkLevelOpenedClassNeeded(item);
  }

  selectOrDeselectPreviousSelection(flag: boolean) {
    let comparisonData = this.dataProvider.getComparisonData();
    if (comparisonData.length != 0) {
      comparisonData.forEach(comparisonItem => {
        if (comparisonItem.id != undefined) {
          if (comparisonItem.levelId == 1) {
            this.levelOneData.find(e => e.id == comparisonItem.id).isSelected = flag;
          }
          else if (comparisonItem.levelId == 2) {
            this.levelTwoData.find(e => e.id == comparisonItem.id).isSelected = flag;
          }
          else if (comparisonItem.levelId == 3) {
            this.levelThreeData.find(e => e.id == comparisonItem.id).isSelected = flag;
          }
          else if (comparisonItem.levelId == 4) {
            this.levelFourData.find(e => e.id == comparisonItem.id).isSelected = flag;
            this.levelFiveData.find(e => e.parentId == comparisonItem.id && e.metricId == comparisonItem.consumptionId).isSelected = flag;
          }
        }
      })
    }

  }

  fiterdata(filterby:any){
    if (filterby.trim().length == 0) {
      this.isSearchList=false;
      return;
    }
    if(filterby.length>=2){
    filterby=filterby.toLowerCase();
   this.filterData=this.levelOneData.filter((val) =>val.searchText.toLowerCase().includes(filterby));
   let leveltwo=this.levelTwoData.filter((val) =>val.searchText.toLowerCase().includes(filterby));
   leveltwo.forEach(e=>{
    this.filterData.push(e);
   })
   let levelthree=this.levelThreeData.filter((val) =>val.searchText.toLowerCase().includes(filterby));
   levelthree.forEach(e=>{
    this.filterData.push(e);
   })
   if(this.isConsumptionAvailable){
    let levelfive=this.levelFiveData.filter((val) =>val.searchText.toLowerCase().includes(filterby));
   levelfive.forEach(e=>{
    this.filterData.push(e);

   })
   }
   else{
    let levelfour=this.levelFourData.filter((val) =>val.searchText.toLowerCase().includes(filterby));
   levelfour.forEach(e=>{
    this.filterData.push(e);

   })
   }
   if(this.filterData.length>=1){
    this.isSearchList=true;
  }
  else{

    this.isSearchList=false;
  }

  }
  else{
    this.filterData=null;
    this.isSearchList=false;
  }


}
  // resetselection(){
  //   this.dataProvider.resetSelectionOnChange("Comparison");
  // }
}
