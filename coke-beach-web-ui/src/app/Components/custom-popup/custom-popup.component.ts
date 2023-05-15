import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-popup',
  templateUrl: './custom-popup.component.html',
  styleUrls: ['./custom-popup.component.css']
})
export class CustomPopupComponent implements OnInit {
  @Input() PopupVisible: boolean;
  @Input() ErrorMsg:string;
  @Output() ToggleShowPopup: EventEmitter<boolean> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  
closepopup(){
  this.PopupVisible=false;
  this.ToggleShowPopup.emit(this.PopupVisible);
}
}
