import { Component, Input, OnInit } from '@angular/core';
import { DataProviderService } from 'src/app/Services/data-provider.service';

@Component({
  selector: 'app-filter-left-panel',
  templateUrl: './filter-left-panel.component.html',
  styleUrls: ['./filter-left-panel.component.css'],
})
export class FilterLeftPanelComponent implements OnInit {
  @Input() filterMenu: any = {};
  @Input() geographyId: string = '';
  levelOneData: any[] = [];
  levelTwoData: any[] = [];
  levelThreeData: any[] = [];
  levelFourData: any[] = [];
  levelFiveData: any[] = [];
  levelSixData: any[] = [];
  levelTwoFilteredData: any[] = [];
  levelThreeFilteredData: any[] = [];
  levelFourFilteredData: any[] = [];
  levelFiveFilteredData: any[] = [];
  levelSixFilteredData: any[] = [];
  isLevelTwoSelected: boolean = false;
  isLevelThreeSelected: boolean = false;
  isLevelFourSelected: boolean = false;
  isLevelFiveSelected: boolean = false;
  isLevelSixSelected: boolean = false;
  filterSelectionObj: any = [];
  levelOneHeader:string="Filters";
  levelTwoHeader:string="";
  levelThreeHeader:string="";
  levelFourHeader:string="Trademark";
  levelFiveHeader:string="Brand";
  levelSixHeader:string="Consumption";
  isBeverageLevelOpened:boolean=false;
  numberOfOpenedPopup:number=1;

  constructor(private dataProvider: DataProviderService) { }

  ngOnInit(): void {
    this.getFilterMenuData();
  }

  // Destructre different data level from the main filter object:
  getFilterMenuData() {
    const { data } = this.filterMenu;
    const [level01, level02, level03, level04, level05, level06] = data;
    const timeObj = this.dataProvider.getTimeperiodData();
    let timeperiodType = timeObj.type;
    this.levelOneData = level01.data;
    this.levelTwoData = level02.data;
    this.levelThreeData = level03.data;
    this.levelFourData = level04.data;
    this.levelFiveData = level05.data;
    this.levelSixData = level06.data;

    if (timeperiodType.toUpperCase() != "12MMT" && timeperiodType.toUpperCase() != "YEAR") {
      this.levelFiveData.forEach(e => { e.hasChild = false; e.consumptionId = 1; e.consumptionName = "Observed Drinkers" });
    }
    else {
      this.levelFiveData.forEach(e => { e.hasChild = true; e.consumptionId = 1; e.consumptionName = "Observed Drinkers" });
    }

    this.levelOneData.forEach(e=>{e.levelId=1;e.isSelected=false;e.isChildOpened=false;});
    this.levelTwoData.forEach(e=>{e.levelId=2;e.isSelected=false;e.isChildOpened=false;});
    this.levelThreeData.forEach(e=>{e.levelId=3;e.isSelected=false;e.isChildOpened=false;});
    this.levelFourData.forEach(e=>{e.levelId=4;e.isSelected=false;e.isChildOpened=false;});
    this.levelFiveData.forEach(e=>{e.levelId=5;e.isSelected=false;e.isChildOpened=false;});
    this.levelSixData.forEach(e => { e.levelId = 6; e.isSelected = false; e.isChildOpened = false; });

    this.selectOrDeselectPreviousSelection(true);
    this.numberOfOpenedPopup=1;
  }

  // Function for opening next level menu:
  openNextLevelPopUp(id: number, levelId: number, text:string) {
    if (levelId === 2) {
      this.isLevelTwoSelected = true;
      this.isLevelThreeSelected = false;
      this.isLevelFourSelected = false;
      this.isLevelFiveSelected = false;
      this.isLevelSixSelected = false;
      this.levelTwoFilteredData = this.levelTwoData.filter(
        (x) => x.parentId === id
      );
      this.dataProvider.clearChildOpenedAtt(this.levelOneData);
      this.dataProvider.clearChildOpenedAtt(this.levelTwoFilteredData);
      this.levelOneData.find(e=>e.id==id).isChildOpened=true;
      this.setBeverageOpenedOrNot(id);
      this.levelTwoHeader=this.getLevelHeader(JSON.parse(JSON.stringify(this.levelOneData)),id,levelId);
      this.numberOfOpenedPopup=2;
    } else if (levelId === 3) {
      this.isLevelThreeSelected = true;
      this.isLevelFourSelected = false;
      this.isLevelFiveSelected = false;
      this.isLevelSixSelected = false;
      this.levelThreeFilteredData = this.levelThreeData.filter(
        (x) => x.parentId === id
      );
      let parentElement = this.levelTwoFilteredData.find(e=>e.id===id);
      if(parentElement.type.toLowerCase()=='filter' && parentElement.text.toLowerCase()!='reason'){
        this.levelThreeFilteredData.map(x=>{x.detailedText=text+" - "+x.text;})
      }
      this.dataProvider.clearChildOpenedAtt(this.levelTwoFilteredData);
      this.dataProvider.clearChildOpenedAtt(this.levelThreeFilteredData);
      this.levelTwoFilteredData.find(e=>e.id==id).isChildOpened=true;
      this.levelThreeHeader=this.getLevelHeader(JSON.parse(JSON.stringify(this.levelTwoFilteredData)),id,levelId);
      this.numberOfOpenedPopup=3;
    } else if(levelId === 4){
      this.isLevelFourSelected = true;
      this.isLevelFiveSelected = false;
      this.isLevelSixSelected = false;
      this.levelFourFilteredData = this.levelFourData.filter(
        (x) => x.parentId === id
      );
      this.levelFourFilteredData.map(x=>{x.detailedText=x.text+" ("+text+")";})
      // this.isLevelFiveSelected = true;
      this.levelFiveFilteredData = this.levelFiveData.filter(
        (x) => x.parentId === id
      );
      this.levelFiveFilteredData.map(x=>{x.detailedText=x.text+" ("+text+")";})
      this.dataProvider.clearChildOpenedAtt(this.levelThreeFilteredData);
      this.dataProvider.clearChildOpenedAtt(this.levelFiveFilteredData);
      this.levelThreeFilteredData.find(e=>e.id==id).isChildOpened=true;
      this.numberOfOpenedPopup=5;
    }
    else{
      this.isLevelSixSelected = true;
      this.levelSixFilteredData = this.levelSixData.filter(x => x.parentId === id);
      this.dataProvider.clearChildOpenedAtt(this.levelFiveFilteredData);
      this.levelFiveFilteredData.find(e => e.id == id).isChildOpened = true;
      this.numberOfOpenedPopup=6;
    }
  }

  // Function to get the selected data and store it in localstorage for building final data:
  getFilterSelectionData(id: number, isSelectable: boolean, levelId: number, selectionType: string): void {
    let selectionObj: any = {};
    let consumptionSelectionObj: any = {};
    let data = this.dataProvider.getFilterData();
    if (data.length !== 0) {
      this.filterSelectionObj = JSON.parse(JSON.stringify(data));
    }
    if (isSelectable) {
      if (levelId === 1) {
        selectionObj = this.levelOneData.find((x) => x.id === id);
        this.dataProvider.clearChildOpenedAtt(this.levelOneData);
      } else if (levelId === 2) {
        selectionObj = this.levelTwoFilteredData.find((x) => x.id === id);
        this.dataProvider.clearChildOpenedAtt(this.levelTwoFilteredData);
      }
      else if (levelId === 3) {
        selectionObj = this.levelThreeFilteredData.find((x) => x.id === id);
        this.dataProvider.clearChildOpenedAtt(this.levelFourFilteredData);
      }

      else if(levelId===4){
        this.isLevelSixSelected=false;
        selectionObj = selectionType === 'TRADEMARK' ? this.levelFourFilteredData.find((x) => x.id === id) : this.levelFiveFilteredData.find((x) => x.id === id);
        if (selectionType === 'BRAND') {
          this.dataProvider.clearChildOpenedAtt(this.levelFiveFilteredData);
        }
      }
      else{
        consumptionSelectionObj = this.levelSixFilteredData.find(x => x.id === id);
        selectionObj = this.levelFiveFilteredData.find(x => x.id === consumptionSelectionObj.parentId);
        this.levelSixFilteredData.forEach(e => {
          if (e.id != id) {
            e.isSelected = false;
          }
        })
        consumptionSelectionObj.isSelected = !consumptionSelectionObj.isSelected;
      }
      if (selectionType == 'BRAND') {
        let item = this.levelFiveData.find(e => e.id == id);
        let consumptionId = item.consumptionId;
        this.levelSixData.filter(e => e.parentId == item.id).forEach(e => {
          if (e.metricId == consumptionId) {
            e.isSelected = !e.isSelected;
          }
          else {
            e.isSelected = false;
          }
        })
      }
      let same = levelId != 5 ? selectionObj.isSelected : (selectionObj.isSelected && selectionObj.consumptionId == consumptionSelectionObj.metricId);

      if (levelId == 5) {
        selectionObj['consumptionId'] = consumptionSelectionObj.metricId;
        selectionObj['consumptionName'] = consumptionSelectionObj.text;
      }
      if (this.filterSelectionObj.some(x => x.id === selectionObj.id) === true) {
        if(same==true){
          let index = this.filterSelectionObj.findIndex(x => x.id === selectionObj.id);
          selectionObj.isSelected=false;
          this.filterSelectionObj.splice(index, 1);
        }
        else{
          let index = this.filterSelectionObj.findIndex(x => x.id === selectionObj.id);
          selectionObj.isSelected = !same;
          let item = this.filterSelectionObj[index];
          item.isSelected = selectionObj.isSelected;
          item.consumptionId = selectionObj.consumptionId;
          item.consumptionName = selectionObj.consumptionName;
        }
        //this.filterSelectionObj.push(selectionObj);
      }

      else {

          selectionObj.isSelected=true;

        this.filterSelectionObj.push(selectionObj);

      }
      this.dataProvider.setFilterData(this.filterSelectionObj);
      localStorage.setItem('FILTER_SELECTION_DATA', JSON.stringify(this.filterSelectionObj)
      );
    }
    else{
      this.openNextLevelPopUp(id, levelId + 1,"");
    }
  }

  checkActiveClass(item:any):boolean{
    return this.dataProvider.checkLevelOpenedClassNeeded(item);
  }
  selectOrDeselectPreviousSelection(flag:boolean){
    let filterData= this.dataProvider.getFilterData();
    if(filterData.length!=0){
      filterData.forEach(filterItem=>{
        if(filterItem.id!=undefined){
          if(filterItem.levelId==1){
            this.levelOneData.find(e=>e.id==filterItem.id).isSelected=flag;
          }
          else if(filterItem.levelId==2){
            this.levelTwoData.find(e=>e.id==filterItem.id).isSelected=flag;
          }
          else if(filterItem.levelId==3){
            this.levelThreeData.find(e=>e.id==filterItem.id).isSelected=flag;
          }
          else if(filterItem.levelId==4){
            this.levelFourData.find(e=>e.id==filterItem.id).isSelected=flag;
          }
          else if(filterItem.levelId==5){
            this.levelFiveData.find(e=>e.id==filterItem.id).isSelected=flag;
            this.levelSixData.find(e=>e.parentId==filterItem.id && e.metricId==filterItem.consumptionId).isSelected = flag;
          }
        }
      })
    }

  }
  setBeverageOpenedOrNot(id:any){
    if(this.isBeverageFilterSelected(id)){
      this.isBeverageLevelOpened=true;
    }
    else{
      this.isBeverageLevelOpened=false;
    }
  }
  isBeverageFilterSelected(id:any){
    let type = this.levelOneData.find(e=>e.id==id).type;
    if(type.toLowerCase()=="BeverageFilter".toLowerCase())
    return true;
    else
    return false;
  }
  getLevelHeader(levelData:any,id:any,levelid:any){
    let text = levelData.find(e=>e.id==id).text;
    let levelHeader="";
    if(this.isBeverageLevelOpened){
      levelHeader=this.getBeverageHeader(levelid);
    }
    else{
      levelHeader=text;
    }
    return levelHeader;
  }
  getBeverageHeader(levelid:any){
    switch(levelid){
      case 2:return "Category";break;
      case 3:return "Detailed Categories";break;
      case 4:return "Trademark";break;
      case 5:return "Brand";break;
      default:return "";
    }
  }
}
