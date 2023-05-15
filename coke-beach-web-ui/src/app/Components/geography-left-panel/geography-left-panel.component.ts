import { Component, Input, OnInit } from '@angular/core';
import { DataProviderService } from 'src/app/Services/data-provider.service';

@Component({
  selector: 'app-geography-left-panel',
  templateUrl: './geography-left-panel.component.html',
  styleUrls: ['./geography-left-panel.component.css']
})
export class GeographyLeftPanelComponent implements OnInit {
  @Input() geographyMenu: any = {};
  levelOneData: any[] = [];
  levelTwoData: any[] = [];
  levelThreeData: any[] = [];
  levelTwoFilteredData: any[] = [];
  levelThreeFilteredData: any[] = [];
  isLevelTwoSelected: boolean = false;
  isLevelThreeSelected: boolean = false;
  geographySelectionObj: any = {};

  constructor(private dataProvider: DataProviderService) { }

  ngOnInit(): void {
    this.getGeographyMenuData();
  }


  // Destructre different data level from the main benchmark object:
  getGeographyMenuData(): void {
    const { data } = this.geographyMenu;
    const [level01, level02, level03] = data;
    this.levelOneData = level01.data;
    this.levelTwoData = level02.data;
    this.levelThreeData = level03.data;
    this.levelOneData.forEach(e => { e.levelId = 1; e.isSelected = false; e.isChildOpened = false; });
    this.levelTwoData.forEach(e => { e.levelId = 2; e.isSelected = false; e.isChildOpened = false; });
    this.levelThreeData.forEach(e => { e.levelId = 3; e.isSelected = false; e.isChildOpened = false; });
    this.dataProvider.clearChildOpenedAtt(this.levelOneData);
    this.clearAllActiveElement();
    this.selectInitialSelection();
  }

  // Function for opening next level menu:
  openNextLevelPopUp(id: number, levelId: number): void {
    if (levelId === 2) {
      this.isLevelTwoSelected = true;
      this.isLevelThreeSelected = false;
      this.levelTwoFilteredData = this.levelTwoData.filter(x => x.parentId === id);
      this.dataProvider.clearChildOpenedAtt(this.levelOneData);
      this.levelOneData.find(e => e.id == id).isChildOpened = true;
    } else {
      this.isLevelThreeSelected = true;
      this.levelThreeFilteredData = this.levelThreeData.filter(x => x.parentId === id);
      this.dataProvider.clearChildOpenedAtt(this.levelTwoFilteredData);
      this.levelTwoFilteredData.find(e => e.id == id).isChildOpened = true;
    }
  }

  // Function to get the selected data and store it in localstorage for building final data:
  getGeographySelectionData(id: number, isSelectable: boolean, levelId: number): void {
    let selectionObj: any = {};
    if (isSelectable) {
      if (levelId === 1) {
        selectionObj = this.levelOneData.find(x => x.id === id);
      } else {
        selectionObj = levelId === 2 ? this.levelTwoFilteredData.find(x => x.id === id) : this.levelThreeFilteredData.find(x => x.id === id);
      }
      this.clearAllActiveElement();
      selectionObj.isSelected = true;
      this.geographySelectionObj = { ...selectionObj }
      this.dataProvider.setGeoData(this.geographySelectionObj);
      localStorage.setItem("GEO_SELECTION_DATA", JSON.stringify(this.geographySelectionObj))
    }
    else {
      this.openNextLevelPopUp(id, levelId + 1);
    }
  }
  checkActiveClass(item: any): boolean {
    return this.dataProvider.checkLevelOpenedClassNeeded(item);
  }

  clearAllActiveElement() {
    this.dataProvider.clearActiveItemAtt(this.levelOneData);
    this.dataProvider.clearActiveItemAtt(this.levelTwoFilteredData);
    this.dataProvider.clearActiveItemAtt(this.levelThreeFilteredData);
    this.dataProvider.clearActiveItemAtt(this.levelTwoData);
    this.dataProvider.clearActiveItemAtt(this.levelThreeData);
  }

  selectInitialSelection() {
    let geographySelected = this.dataProvider.getGeoData();
    if (geographySelected.id != undefined) {
      if (geographySelected.levelId == 1) {
        this.levelOneData.find(e => e.id == geographySelected.id).isSelected = true;
      }
      else if (geographySelected.levelId == 2) {
        this.levelTwoData.find(e => e.id == geographySelected.id).isSelected = true;
      }
      else if (geographySelected.levelId == 3) {
        this.levelThreeData.find(e => e.id == geographySelected.id).isSelected = true;
      }
    }
  }
  // resetselection(){
  //   this.dataProvider.resetSelectionOnChange("Geography");
  // }
}
