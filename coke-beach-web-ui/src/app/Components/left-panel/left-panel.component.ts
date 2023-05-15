import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import * as fileSaver from 'file-saver';
import {
  BENCHMARK_ACTIVE_IMAGE,
  BENCHMARK_IMAGE,
  BENCHMARK_SELECTION_ERROR,
  COMPARE_ACTIVE_IMAGE,
  COMPARE_IMAGE,
  COMPARISON_SELECTION_ERROR,
  FILTER_ACTIVE_IMAGE,
  FILTER_IMAGE,
  SELECTION_ERROR,
  GEO_ACTIVE_IMAGE,
  GEO_IMAGE,
  TIMEPERIOD_SELECTION_ERROR,
  TIME_PERIOD_ACTIVE_IMAGE,
  TIME_PERIOD_IMAGE,
  GEO_TEXT_IMAGE,
  GEO_ACTIVE_TEXT_IMAGE,
  BENCHMARK_TEXT_IMAGE,
  COMPARE_TEXT_IMAGE,
  FILTER_TEXT_IMAGE,
  TIME_PERIOD_TEXT_IMAGE,
  TIME_PERIOD_ACTIVE_TEXT_IMAGE,
  COMPARE_ACTIVE_TEXT_IMAGE,
  BENCHMARK_ACTIVE_TEXT_IMAGE,
  FILTER_ACTIVE_TEXT_IMAGE,
} from 'src/app/Constants/Constant';
import { LeftPanelService } from 'src/app/Services/left-panel.service';
import { SwalNotificationService } from 'src/app/Services/swal-notification.service';
import { DataProviderService } from 'src/app/Services/data-provider.service';
import Swal from 'sweetalert2';
import { IfStmt } from '@angular/compiler';
import { delay } from 'rxjs/operators';
import { MsalService } from '@azure/msal-angular';
import { environment } from 'src/environments/environment';
import { ProfileType } from 'src/app/Constants/ProfileType';
import { HttpClient } from '@angular/common/http';
import { DataAvailabilityComponent } from '../data-availability/data-availability.component';


@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.css'],
})

export class LeftPanelComponent implements OnInit {
  @Input() isOpactiyApplied: boolean;
  @Output() toggleOpacity: EventEmitter<boolean> = new EventEmitter();
  @ViewChild(DataAvailabilityComponent ) child :DataAvailabilityComponent ;

  isGeographyMenuOpen: boolean = false;
  isFilterMenuOpen: boolean = false;
  isfilter_level2selactive: boolean = false;
  istime_p_selactive: boolean = false;
  isBenchmarkMenuOpen: boolean = false;
  isComaprisonMenuOpen: boolean = false;
  isbenchmark_cat_d_selactive: boolean = false;
  isbenchmark_trademark_selactive: boolean = false;
  isbenchmark_brand_selactive: boolean = false;
  isbenchmark_consumption_selactive: boolean = false;
  is_show_all_selection: boolean = false;

  // Active/Non-Active image togglers
  isGeoImgActive: boolean = false;
  isTimeImgActive: boolean = false;
  isBenchmarkImgActive: boolean = false;
  isCompareImgActive: boolean = false;
  isFilterImgActive: boolean = false;
  geoImage = GEO_IMAGE;
  geoTextImage=GEO_TEXT_IMAGE;
  timeImage = TIME_PERIOD_IMAGE;
  timePeriodTextImage=TIME_PERIOD_TEXT_IMAGE;
  benchmarkImage = BENCHMARK_IMAGE;
  benchmarkTextImage=BENCHMARK_TEXT_IMAGE;
  compareImage = COMPARE_IMAGE;
  compareTextImage=COMPARE_TEXT_IMAGE;
  filterImage = FILTER_IMAGE;
  filterTextImage=FILTER_TEXT_IMAGE;

  //selection_panel...........
  isgeography_sel_panel_ctn_active: boolean = false;
  istimeperiod_sel_panel_ctn_active: boolean = false;
  isbenchmark_sel_panel_ctn_active: boolean = false;
  iscompa_sel_panel_ctn_active: boolean = false;
  isfilter_sel_panel_ctn_active: boolean = false;
  geographyseldata: any;
  yearvalue: any;
  monthvalue: any;
  year: any;
  benchmarkvalue: any;
  filtervalue: any;

  geographyMenu: any = {};
  timeperiodMenu: any = {};
  benchmarkMenu: any = {};
  comparisonMenu: any = {};
  filterMenu: any = {};
  geographyId: number;
  isLeftPanelDataLoaded: boolean = false;
  getSelection: any = [];
  profile!: ProfileType;
  UserDataTable:any[];
  UserManagementAccess:boolean=false;

  //popup
  isShowPopup:boolean=false;
  ErrorMsg:string="";
  isSampleSizePopup:boolean=false;
  SampleSizeErrorMsg:string="";
  sampleSize:any={}


  constructor(
    private leftPanelService: LeftPanelService,
    private notification: SwalNotificationService,
    private dataProvider: DataProviderService,
    private authService: MsalService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getLeftPanelData();
    this.dataProvider.getSampleSizePopupValue().subscribe(e=>this.isSampleSizePopup=e);
    this.GetProfile();

  }
  CheckUserManagementAccess(){
 this.leftPanelService.GetUserData().subscribe((res) => {
      this.UserDataTable=res;
      for(let i=0;i<this.UserDataTable.length;i++){
        if(this.UserDataTable[i].emailId==this.profile?.mail){
          if(this.UserDataTable[i].role=="Admin"){
            this.UserManagementAccess=true;
          }
          else{
            this.UserManagementAccess=false;
          }
        }
      }
    })


  }


  GetProfile() {
    this.http.get('https://graph.microsoft.com/v1.0/me')
      .subscribe(profile => {
        this.profile = profile;
       this.CheckUserManagementAccess();
      });
  }
  Logout() {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: environment.redirectUri
    });
  }
  TogglePopup(data): void {
    this.isShowPopup = data;
  }
  ToggleSamplesizePopup(data){
    this.isSampleSizePopup = data;
    this.samplesizeContinueToProcess();
  }
   ShowPopup(msg:any){
    this.isShowPopup=!this.isShowPopup;
    this.ErrorMsg="";
    this.ErrorMsg=msg;
  }
  OpenDataAvailabilityPopup(){
    this.child.OpenPopup();
  }
  CloseDataAvailabilityPopup(){
    this.child.ClosePopup();
  }
  ShowSampleSizePopup(msg:any){
    //this.isSampleSizePopup=!this.isSampleSizePopup;
    this.dataProvider.setSampleSizePopupValue(!this.isSampleSizePopup);
    this.SampleSizeErrorMsg="";
    this.SampleSizeErrorMsg=msg;
  }

  getLeftPanelData() {
    this.leftPanelService.getGeoLeftPanel().subscribe((res) =>{
      const {
        geographyMenu,
      } = res;
      this.geographyMenu = geographyMenu;
      this.dataProvider.setLeftPanelLoaded(true);
    });
  }


  geography(): void {
    this.isGeoImgActive = !this.isGeoImgActive;
    this.geoImage = this.isGeoImgActive ? GEO_ACTIVE_IMAGE : GEO_IMAGE;
    this.geoTextImage=this.isGeoImgActive ? GEO_ACTIVE_TEXT_IMAGE : GEO_TEXT_IMAGE;
    this.toggelImages('GEO');
    // Close all other menu code starts here
    this.istime_p_selactive = false;
    this.isBenchmarkMenuOpen = false;
    this.isFilterMenuOpen = false;
    this.isComaprisonMenuOpen = false;
    // Close all other menu code ends here
    this.isGeographyMenuOpen = !this.isGeographyMenuOpen;
    if (this.isGeographyMenuOpen == true) {
      this.isOpactiyApplied = true;
      this.toggleOpacity.emit(this.isOpactiyApplied);
    } else {
      this.isOpactiyApplied = false;
      this.toggleOpacity.emit(this.isOpactiyApplied);
    }
  }

  getTimePeriodData(): void {
    let { isEmpty, geoObj } = this.isGeographySelected();
    if (isEmpty) {
      // this.notification.displayErrorMessage(`Please complete the following mandatory selection(s): Geography`);
      this.ShowPopup('Please complete the following mandatory selection(s):<b>Geography</b>');
    } else {
      this.dataProvider.setLeftPanelLoaded(false);
      this.leftPanelService.getBenchmarkLeftPanel(geoObj.geographyId).subscribe((res) => {
        const {
          timeperiodMenu,
          benchmarkMenu,
          comparisonMenu,
          filterMenu,
        } = res;
        this.timeperiodMenu = timeperiodMenu;
        this.benchmarkMenu = benchmarkMenu;
        this.comparisonMenu = comparisonMenu;
        this.filterMenu = filterMenu;
        this.timeperiodMenu.map((e) => e.isShow = false);
        this.dataProvider.setLeftPanelLoaded(true);
        this.timePeriod();
      });
    }
  }

  timePeriod(): void {
    let { isEmpty, geoObj } = this.isGeographySelected();
    if (isEmpty) {
      // this.notification.displayErrorMessage(GEOGRAPHY_SELECTION_ERROR);
      this.ShowPopup('Please complete the following mandatory selection(s):<b>Geography</b>');
    }
    else {
      this.isTimeImgActive = !this.isTimeImgActive;
      this.timeImage = this.isTimeImgActive
        ? TIME_PERIOD_ACTIVE_IMAGE
        : TIME_PERIOD_IMAGE;
      this.timePeriodTextImage= this.isTimeImgActive?TIME_PERIOD_ACTIVE_TEXT_IMAGE:TIME_PERIOD_TEXT_IMAGE;
      this.toggelImages('TIME');
      // Close all other menu code starts here
      this.isBenchmarkMenuOpen = false;
      this.isGeographyMenuOpen = false;
      this.isFilterMenuOpen = false;
      this.isComaprisonMenuOpen = false;
      // Close all other menu code ends here
      this.istime_p_selactive = !this.istime_p_selactive;
      if (this.istime_p_selactive == true) {
        this.isOpactiyApplied = true;
        this.toggleOpacity.emit(this.isOpactiyApplied);
      } else {
        this.isOpactiyApplied = false;
        this.toggleOpacity.emit(this.isOpactiyApplied);
      }
    }
  }

  benchmark(): void {
    let { isEmpty } = this.isGeographySelected();
    let { istime_p_Empty } = this.isTimeperiodSelected();
    if (isEmpty || istime_p_Empty) {
      let emptySelections = [
        {
          isSelected: isEmpty,
          text: 'Geography'
        },
        {
          isSelected: istime_p_Empty,
          text: 'Time Period'
        }
      ]
      let errorMessage = 'Please complete the following mandatory selection(s):';
      let tempArray = emptySelections.filter(x => x.isSelected);
      const tempErrorMessage = tempArray.map(x => x.text).join(', ');
      // this.notification.displayErrorMessage(`${errorMessage} ${tempErrorMessage}`);
      this.ShowPopup(`${errorMessage}<b>${tempErrorMessage}</b>`)
    }
    else {
      this.isBenchmarkImgActive = !this.isBenchmarkImgActive;
      this.benchmarkImage = this.isBenchmarkImgActive
        ? BENCHMARK_ACTIVE_IMAGE
        : BENCHMARK_IMAGE;
      this.benchmarkTextImage=this.isBenchmarkImgActive?BENCHMARK_ACTIVE_TEXT_IMAGE:BENCHMARK_TEXT_IMAGE;
      this.toggelImages('BENCHMARK');
      // Close all other menu code starts here
      this.istime_p_selactive = false;
      this.isGeographyMenuOpen = false;
      this.isFilterMenuOpen = false;
      this.isComaprisonMenuOpen = false;
      // Close all other menu code end here
      this.isBenchmarkMenuOpen = !this.isBenchmarkMenuOpen;
      if (this.isBenchmarkMenuOpen == true) {
        this.isOpactiyApplied = true;
        this.toggleOpacity.emit(this.isOpactiyApplied);
      } else {
        this.isOpactiyApplied = false;
        this.toggleOpacity.emit(this.isOpactiyApplied);
      }
    }
  }

  comparison(): void {
    let { isEmpty, geoObj } = this.isGeographySelected();
    let { istime_p_Empty } = this.isTimeperiodSelected();
    let { is_benchmark_Empty } = this.isBechmarkSelected();
    if (isEmpty || istime_p_Empty || is_benchmark_Empty) {
      let emptySelections = [
        {
          isSelected: isEmpty,
          text: 'Geography'
        },
        {
          isSelected: istime_p_Empty,
          text: 'Time Period'
        },
        {
          isSelected: is_benchmark_Empty,
          text: 'Benchmark'
        }
      ]
      let errorMessage = 'Please complete the following mandatory selection(s):';
      let tempArray = emptySelections.filter(x => x.isSelected);
      const tempErrorMessage = tempArray.map(x => x.text).join(', ');
      // this.notification.displayErrorMessage(`${errorMessage} ${tempErrorMessage}`);
      this.ShowPopup(`${errorMessage}<b>${tempErrorMessage}</b>`)
    }
    else {
      this.geographyId = geoObj.geographyId;
      this.isCompareImgActive = !this.isCompareImgActive;
      this.compareImage = this.isCompareImgActive
        ? COMPARE_ACTIVE_IMAGE
        : COMPARE_IMAGE;
      this.compareTextImage=this.isCompareImgActive?COMPARE_ACTIVE_TEXT_IMAGE:COMPARE_TEXT_IMAGE;
      this.toggelImages('COMAPRE');
      // Close all other menu code starts here
      this.isGeographyMenuOpen = false;
      this.istime_p_selactive = false;
      this.isBenchmarkMenuOpen = false;
      this.isFilterMenuOpen = false;
      // Close all other menu code ends here
      this.isComaprisonMenuOpen = !this.isComaprisonMenuOpen;
      if (this.isComaprisonMenuOpen == true) {
        this.isOpactiyApplied = true;
        this.toggleOpacity.emit(this.isOpactiyApplied);
      } else {
        this.isOpactiyApplied = false;
        this.toggleOpacity.emit(this.isOpactiyApplied);
      }
    }
  }

  filters(): void {
    let { isEmpty } = this.isGeographySelected();
    let { istime_p_Empty } = this.isTimeperiodSelected();
    let { is_benchmark_Empty } = this.isBechmarkSelected();
    let { is_comparison_Empty } = this.isComparisonSelected();
    if (isEmpty || istime_p_Empty || is_benchmark_Empty || is_comparison_Empty) {
      let emptySelections = [
        {
          isSelected: isEmpty,
          text: 'Geography'
        },
        {
          isSelected: istime_p_Empty,
          text: 'Time Period'
        },
        {
          isSelected: is_benchmark_Empty,
          text: 'Benchmark'
        },
        {
          isSelected: is_comparison_Empty,
          text: 'Comparison'
        }
      ]
      let errorMessage = 'Please complete the following mandatory selection(s):';
      let tempArray = emptySelections.filter(x => x.isSelected);
      const tempErrorMessage = tempArray.map(x => x.text).join(', ');
      // this.notification.displayErrorMessage(`${errorMessage} ${tempErrorMessage}`);
      this.ShowPopup(`${errorMessage}<b>${tempErrorMessage}</b>`)
    }
    else {
      this.isFilterImgActive = !this.isFilterImgActive;
      this.filterImage = this.isFilterImgActive
        ? FILTER_ACTIVE_IMAGE
        : FILTER_IMAGE;
      this.filterTextImage=this.isFilterImgActive?FILTER_ACTIVE_TEXT_IMAGE:FILTER_TEXT_IMAGE;
      this.toggelImages('FILTER');
      // Close all other menu code starts here
      this.isGeographyMenuOpen = false;
      this.istime_p_selactive = false;
      this.isBenchmarkMenuOpen = false;
      this.isComaprisonMenuOpen = false;
      // Close all other menu code ends here
      this.isFilterMenuOpen = !this.isFilterMenuOpen;
      if (this.isFilterMenuOpen == true) {
        this.isOpactiyApplied = true;
        this.toggleOpacity.emit(this.isOpactiyApplied);
      } else {
        this.isOpactiyApplied = false;
        this.toggleOpacity.emit(this.isOpactiyApplied);
      }
    }
  }

  isGeographySelected(): any {
    // const geoObj = JSON.parse(localStorage.getItem('GEO_SELECTION_DATA'));
    const geoObj = this.dataProvider.getGeoData();
    let isEmpty = (geoObj === null || Object.keys(geoObj).length == 0);
    return { isEmpty, geoObj };
  }

  isTimeperiodSelected(): any {
    //const TimeperiodObj = JSON.parse(localStorage.getItem('TIMEPERIOD_SELECTION_DATA'));
    const TimeperiodObj = this.dataProvider.getTimeperiodData();
    let istime_p_Empty = (TimeperiodObj === null || Object.keys(TimeperiodObj).length == 0);
    return { istime_p_Empty, TimeperiodObj };
  }

  isBechmarkSelected(): any {
    //const BenchmarkObj = JSON.parse(localStorage.getItem('BENCHMARK_SELECTION_DATA'));
    const BenchmarkObj = this.dataProvider.getBenchmarkData();
    let is_benchmark_Empty = (BenchmarkObj === null || Object.keys(BenchmarkObj).length == 0);
    return { is_benchmark_Empty, BenchmarkObj };
  }

  isComparisonSelected(): any {
    //const ComparisonObj = JSON.parse(localStorage.getItem('COMPARISON_SELECTION_DATA'));
    const ComparisonObj = this.dataProvider.getComparisonData();
    let is_comparison_Empty = (ComparisonObj === null || ComparisonObj.length == 0);
    return { is_comparison_Empty, ComparisonObj };
  }

  toggelImages(stubName: string): void {
    if (stubName === 'GEO') {
      this.timeImage = TIME_PERIOD_IMAGE;
      this.timePeriodTextImage=TIME_PERIOD_TEXT_IMAGE;
      this.isTimeImgActive = false;
      this.benchmarkImage = BENCHMARK_IMAGE;
      this.benchmarkTextImage=BENCHMARK_TEXT_IMAGE;
      this.isBenchmarkImgActive = false;
      this.compareImage = COMPARE_IMAGE;
      this.compareTextImage=COMPARE_TEXT_IMAGE;
      this.isCompareImgActive = false;
      this.filterImage = FILTER_IMAGE;
      this.filterTextImage=FILTER_TEXT_IMAGE;
      this.isFilterImgActive = false;
    } else if (stubName === 'TIME') {
      this.geoImage = GEO_IMAGE;
      this.geoTextImage=GEO_TEXT_IMAGE;
      this.isGeoImgActive = false;
      this.benchmarkImage = BENCHMARK_IMAGE;
      this.benchmarkTextImage=BENCHMARK_TEXT_IMAGE;
      this.isBenchmarkImgActive = false;
      this.compareImage = COMPARE_IMAGE;
      this.compareTextImage=COMPARE_TEXT_IMAGE;
      this.isCompareImgActive = false;
      this.filterImage = FILTER_IMAGE;
      this.filterTextImage=FILTER_TEXT_IMAGE;
      this.isFilterImgActive = false;
    } else if (stubName === 'BENCHMARK') {
      this.geoImage = GEO_IMAGE;
      this.geoTextImage=GEO_TEXT_IMAGE;
      this.isGeoImgActive = false;
      this.timeImage = TIME_PERIOD_IMAGE;
      this.timePeriodTextImage=TIME_PERIOD_TEXT_IMAGE;
      this.isTimeImgActive = false;
      this.compareImage = COMPARE_IMAGE;
      this.compareTextImage=COMPARE_TEXT_IMAGE;
      this.isCompareImgActive = false;
      this.filterImage = FILTER_IMAGE;
      this.filterTextImage=FILTER_TEXT_IMAGE;
      this.isFilterImgActive = false;
    } else if (stubName === 'COMAPRE') {
      this.geoImage = GEO_IMAGE;
      this.geoTextImage=GEO_TEXT_IMAGE;
      this.isGeoImgActive = false;
      this.timeImage = TIME_PERIOD_IMAGE;
      this.timePeriodTextImage=TIME_PERIOD_TEXT_IMAGE;
      this.isTimeImgActive = false;
      this.benchmarkImage = BENCHMARK_IMAGE;
      this.benchmarkTextImage=BENCHMARK_TEXT_IMAGE;
      this.isBenchmarkImgActive = false;
      this.filterImage = FILTER_IMAGE;
      this.filterTextImage=FILTER_TEXT_IMAGE;
      this.isFilterImgActive = false;
    } else if (stubName === 'FILTER') {
      this.geoImage = GEO_IMAGE;
      this.geoTextImage=GEO_TEXT_IMAGE;
      this.isGeoImgActive = false;
      this.timeImage = TIME_PERIOD_IMAGE;
      this.timePeriodTextImage=TIME_PERIOD_TEXT_IMAGE;
      this.isTimeImgActive = false;
      this.benchmarkImage = BENCHMARK_IMAGE;
      this.benchmarkTextImage=BENCHMARK_TEXT_IMAGE;
      this.isBenchmarkImgActive = false;
      this.compareImage = COMPARE_IMAGE;
      this.compareTextImage=COMPARE_TEXT_IMAGE;
      this.isCompareImgActive = false;
    }
  }

  //benchmark selection
  benchmark_Detailed_Cate_active() {
    this.isbenchmark_cat_d_selactive = !this.isbenchmark_cat_d_selactive;
    if (this.isbenchmark_cat_d_selactive != true) {
      this.isbenchmark_trademark_selactive = false;
      this.isbenchmark_brand_selactive = false;
      this.isbenchmark_consumption_selactive = false;
    }
  }

  benchmark_trademark_active() {
    this.isbenchmark_trademark_selactive =
      !this.isbenchmark_trademark_selactive;
    if (this.isbenchmark_trademark_selactive != true) {
      this.isbenchmark_brand_selactive = false;
      this.isbenchmark_consumption_selactive = false;
    }
  }

  benchmark_brand_active() {
    this.isbenchmark_brand_selactive = !this.isbenchmark_brand_selactive;
    if (this.isbenchmark_brand_selactive != true) {
      this.isbenchmark_consumption_selactive = false;
    }
  }

  benchmark_consumption_active() {
    this.isbenchmark_consumption_selactive =
      !this.isbenchmark_consumption_selactive;
  }

  gettimeperiod_sel(data: any) {
    this.year = this.year = data;
    if (this.year == '') {
      this.istimeperiod_sel_panel_ctn_active =
        this.istimeperiod_sel_panel_ctn_active = false;
    } else {
      this.istimeperiod_sel_panel_ctn_active =
        this.istimeperiod_sel_panel_ctn_active = true;
    }
  }

  getmonthvalue(data: any) {
    this.monthvalue = this.monthvalue = data;
  }

  getfilter_sel(data: any) {
    this.filtervalue = this.filtervalue = data;
    this.isfilter_sel_panel_ctn_active = this.isfilter_sel_panel_ctn_active =
      true;
  }

  filterlevel2active() {
    this.isfilter_level2selactive = !this.isfilter_level2selactive;
  }

  show_all_selections() {
    this.is_show_all_selection = !this.is_show_all_selection;
    this.closeAllLeftPanelPopup();
    if (this.is_show_all_selection == true) {
      this.isOpactiyApplied = true;
      this.toggleOpacity.emit(this.isOpactiyApplied);
    }
    else {
      this.isOpactiyApplied = false;
      this.toggleOpacity.emit(this.isOpactiyApplied);
    }
  }

  CloseAllPopup() {
    this.closeAllLeftPanelPopup();
    if (this.is_show_all_selection == false) {
      this.isOpactiyApplied = false;
      this.toggleOpacity.emit(this.isOpactiyApplied);
    }
  }

  checkSampleSize(): void {
    this.CloseAllPopup();
    let { isEmpty } = this.isGeographySelected();
    let { istime_p_Empty } = this.isTimeperiodSelected();
    let { is_benchmark_Empty } = this.isBechmarkSelected();
    let { is_comparison_Empty } = this.isComparisonSelected();
    if (isEmpty || istime_p_Empty || is_benchmark_Empty || is_comparison_Empty) {
      let emptySelections = [
        {
          isSelected: isEmpty,
          text: 'Geography'
        },
        {
          isSelected: istime_p_Empty,
          text: 'Time Period'
        },
        {
          isSelected: is_benchmark_Empty,
          text: 'Benchmark'
        },
        {
          isSelected: is_comparison_Empty,
          text: 'Comparison'
        }
      ]
      let errorMessage = 'Please complete the following mandatory selection(s):';
      let tempArray = emptySelections.filter(x => x.isSelected);
      const tempErrorMessage = tempArray.map(x => x.text).join(', ');
      // this.notification.displayErrorMessage(`${errorMessage} ${tempErrorMessage}`);
      this.ShowPopup(`${errorMessage}<b>${tempErrorMessage}</b>`)
    }
    else {
      this.dataProvider.setLeftPanelLoaded(false);
      let selectionData = this.dataProvider.getAllSelectionData();
      // let sampleSize;
      this.leftPanelService.checkSampleSize(selectionData).subscribe(data => {
        this.sampleSize = data;
        this.dataProvider.setLeftPanelLoaded(true);
        if (data.length === 0) {
          this.submitData();
        }
        else {
          let sampleSizeArray = this.sampleSize.map(x => x.selectionType + ': ' + x.detailedText);
          let sampleSizeText = sampleSizeArray.join(', ');
          let errorMessage='SAMPLE SIZE IS LESS THAN 30 FOR THE FOLLOWING:';
          // Swal.fire({
          //   title: 'SAMPLE SIZE IS LESS THAN 30 FOR THE FOLLOWING',
          //   text: sampleSizeText,
          //   icon: 'warning',
          //   showCancelButton: true,
          //   confirmButtonText: 'Proceed',
          //   cancelButtonText: 'Cancel',
          //   confirmButtonColor: 'grey'
          // }).then((result) => {
          //   if (result.value) {
          //     for (let i = 0; i < sampleSize.length; i++) {
          //       let c = sampleSize[i];
          //       if (c.selectionType === "Benchmark") {
          //         this.dataProvider.setBenchmarkData({});
          //       }
          //       else if (c.selectionType === "Comparison") {
          //         const comparedata = this.dataProvider.getComparisonData();
          //         let index = comparedata.indexOf(x => x.id === c.selectionID);
          //         comparedata.splice(index, 1);
          //         this.dataProvider.setComparisonData(comparedata);
          //       }
          //     }
          //     this.submitData();
          //   }
          //   else if (result.dismiss === Swal.DismissReason.cancel) { }
          // })
          this.ShowSampleSizePopup(`${errorMessage}<b>${sampleSizeText}</b>`);
        }
      });
    }
  }
   samplesizeContinueToProcess(){
      for (let i = 0; i < this.sampleSize.length; i++) {
        let c = this.sampleSize[i];
        if (c.selectionType === "Benchmark") {
          this.dataProvider.setBenchmarkData({});
        }
        else if (c.selectionType === "Comparison") {
          const comparedata = this.dataProvider.getComparisonData();
          let index = comparedata.findIndex(x => x.text === c.selectionName && x.consumptionId===c.consumptionId);
          comparedata.splice(index, 1);
          this.dataProvider.setComparisonData(comparedata);
        }
      }
      this.submitData();
    }

  submitData(): void {
    let { isEmpty } = this.isGeographySelected();
    let { istime_p_Empty } = this.isTimeperiodSelected();
    let { is_benchmark_Empty } = this.isBechmarkSelected();
    let { is_comparison_Empty } = this.isComparisonSelected();
    if (isEmpty || istime_p_Empty || is_benchmark_Empty || is_comparison_Empty) {
      let emptySelections = [
        {
          isSelected: isEmpty,
          text: 'Geography'
        },
        {
          isSelected: istime_p_Empty,
          text: 'Time Period'
        },
        {
          isSelected: is_benchmark_Empty,
          text: 'Benchmark'
        },
        {
          isSelected: is_comparison_Empty,
          text: 'Comparison'
        }
      ]
      let errorMessage = 'Please complete the following mandatory selection(s):';
      let tempArray = emptySelections.filter(x => x.isSelected);
      const tempErrorMessage = tempArray.map(x => x.text).join(', ');
      // this.notification.displayErrorMessage(`${errorMessage} ${tempErrorMessage}`);
      this.ShowPopup(`${errorMessage}<b>${tempErrorMessage}</b>`)
    }
    else {
      this.filterImage = FILTER_IMAGE;
      this.isFilterImgActive = false;
      this.isFilterMenuOpen = false;
      let data = this.dataProvider.getAllSelectionData();
      this.getSelection = this.dataProvider.getAllSelectionData();
      this.getSelection.emailId = this.profile.mail;
      this.isOpactiyApplied = false;
      this.toggleOpacity.emit(this.isOpactiyApplied);
      this.dataProvider.setLeftPanelLoaded(false);
      // this.leftPanelService.submitLeftPanelData(data).subscribe(data => {
      //   let blob: any = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
      //   fileSaver.saveAs(blob, 'Output.pptx');
      //   this.dataProvider.setLeftPanelLoaded(true);
      // });
      this.leftPanelService.submitLeftPanelData(data).subscribe(data => {
        let obj = setInterval(() => { pollStatus() }, 5000);
        let pollStatus = () => {
          this.leftPanelService.pollStatusService(data).subscribe(data => {
            if (data.isCompleted) {
              clearInterval(obj);
              this.downloadFile(data);
              this.leftPanelService.UserStats(this.getSelection).subscribe((data :any)=>{})

            }
            else if (data.isError) {
              clearInterval(obj);
              this.dataProvider.setLeftPanelLoaded(true);
            }
          },
            error => {
              clearInterval(obj);
              console.log(error);
              this.dataProvider.setLeftPanelLoaded(true);
            }
          )
        }
      },
        error => {
          console.log(error);
          this.dataProvider.setLeftPanelLoaded(true);
        }
      );
      //localStorage.clear();
    }
  }

  downloadFile(id: any): void {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    this.leftPanelService.downloadFileService(id).subscribe(data => {
      this.dataProvider.setLeftPanelLoaded(true);
      let blob: any = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
      fileSaver.saveAs(blob, `The 5 W's Report - ${currentDate}.pptx`);

      //this.dataProvider.setLeftPanelLoaded(true);
    })
  }
  closeAllPopup(type: string) {
    this.closeAllLeftPanelPopup();
    if (this.is_show_all_selection == false) {
      this.isOpactiyApplied = false;
      this.toggleOpacity.emit(this.isOpactiyApplied);
    }
  }

  closeAllLeftPanelPopup() {
    this.isGeographyMenuOpen = false;
    this.istime_p_selactive = false;
    this.isBenchmarkMenuOpen = false;
    this.isComaprisonMenuOpen = false;
    this.isFilterMenuOpen = false;
    this.geoImage = GEO_IMAGE;
    this.geoTextImage=GEO_TEXT_IMAGE;
    this.isGeoImgActive = false;
    this.timeImage = TIME_PERIOD_IMAGE;
    this.timePeriodTextImage=TIME_PERIOD_TEXT_IMAGE;
    this.isTimeImgActive = false;
    this.benchmarkImage = BENCHMARK_IMAGE;
    this.benchmarkTextImage=BENCHMARK_TEXT_IMAGE;
    this.isBenchmarkImgActive = false;
    this.compareImage = COMPARE_IMAGE;
    this.compareTextImage=COMPARE_TEXT_IMAGE;
    this.isCompareImgActive = false;
    this.filterImage = FILTER_IMAGE;
    this.filterTextImage=FILTER_TEXT_IMAGE;
    this.isFilterImgActive = false;
  }
  resetSelection(){
    this.CloseAllPopup();
    this.dataProvider.setGeoData({});
  }

}
