import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataProviderService } from 'src/app/Services/data-provider.service';

@Component({
  selector: 'app-samplesize-popup',
  templateUrl: './samplesize-popup.component.html',
  styleUrls: ['./samplesize-popup.component.css']
})
export class SamplesizePopupComponent implements OnInit {

  @Input() SampleSizePopupVisible: boolean;
  @Input() SampleSizeErrorMsg:string;
  @Output() ToggleSamplesizeShowPopup: EventEmitter<boolean> = new EventEmitter();
  constructor(private dataProvider: DataProviderService) { }

  ngOnInit(): void {
  }
closepopup(){
  this.SampleSizePopupVisible=false;
  this.ToggleSamplesizeShowPopup.emit(this.SampleSizePopupVisible);
}
cancelClosepopup(){
  this.SampleSizePopupVisible=false;
  this.dataProvider.setSampleSizePopupValue(false);
}
}
