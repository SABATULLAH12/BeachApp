import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalNotificationService {

  constructor() { }

  displayErrorMessage(errorMessage: string) {
    Swal.fire({
      icon: 'error',
      text: `${errorMessage}`,
      confirmButtonColor: '#dc3545'
    });
  }

  displaysucess(){
    Swal.fire({
      icon: 'success',
      text: `Data is submitted`,
      confirmButtonColor: '#dc3545'
    });
  }
}
