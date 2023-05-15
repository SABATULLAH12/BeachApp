import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeftPanelService {
  leftPanelDataUrl: string = '../assets/LeftPanel.json';

  constructor(private http: HttpClient) { }

  getGeoLeftPanel(): Observable<any> {
    return this.http.get<any>(`${environment.apim}GetGeoLeftPanel`);
  }

  getBenchmarkLeftPanel(countryId: string): Observable<any> {
    const countryObj = {
      CountryId: countryId
    }
    return this.http.post(`${environment.apim}GetBenchmarkLeftPanel`, countryObj);
  }

  checkSampleSize(leftPanelData: any): Observable<any[]> {
    let headers = new HttpHeaders().set("Ocp-Apim-Subscription-Key", "556f153c08e04091ab07770150946203").set('responseType', 'blob');
    return this.http.post<any[]>(`${environment.apim}CheckSampleSize`, leftPanelData);
  }

  submitLeftPanelData(leftPanelData: any): Observable<any> {
    // let headers = new HttpHeaders().set("Ocp-Apim-Subscription-Key", "556f153c08e04091ab07770150946203").set('responseType', 'blob');
    let headers = new HttpHeaders().set('responseType', 'json');
    return this.http.post(`${environment.apim}ReportGenerator`,
      leftPanelData, { responseType: 'json' });
  }

  pollStatusService(id: any): Observable<any> {
    return this.http.post(`${environment.apim}PollStatus`,
      id, { responseType: 'json' });
  }

  downloadFileService(id: any): Observable<any> {
    return this.http.post(`${environment.apim}Download`,
      id, { responseType: 'blob' });
  }

  AddUser(UserData:any): Observable<any> {
    let headers = new HttpHeaders().set('responseType', 'json');
    return this.http.post(`${environment.apim}AddUser`,
    UserData);
  }
  GetUserData(): Observable<any> {
    return this.http.get<any>(`${environment.apim}GetUserDetails`);
  }
  GetLeftPanelData(): Observable<any> {
    return this.http.get<any>(`${environment.apim}GetUSMLeftPanel`);
  }
  UpdateUserRole(UserData:any): Observable<any> {
    let headers = new HttpHeaders().set('responseType', 'json');
    return this.http.put(`${environment.apim}UpdateUserRole`,
    UserData, { responseType: 'json' });
  }
  UserStats(SelectionDetails:any): Observable<any> {
    let headers = new HttpHeaders().set('responseType', 'json');
    return this.http.post(`${environment.apim}AddUserSelectionStats`,
    SelectionDetails, { responseType: 'json' });
  }
  GetCountReportCount(roleid:string,timeperiodID:any): Observable<any> {
    if(timeperiodID===""){
      timeperiodID=-1;
    }
    if(roleid===undefined){
      roleid="";
    }
    let headers = new HttpHeaders().set('responseType', 'json');
    return this.http.get(`${environment.apim}GetReportCount?RoleId=${roleid}&TimePeriodId=${timeperiodID}`,
     { responseType: 'json' });
  }
  GetReportDetails(roleid:string,timeperiodID:any): Observable<any> {
    if(timeperiodID===""){
      timeperiodID=-1;
    }
    if(roleid===undefined){
      roleid=null;
    }
    let headers = new HttpHeaders().set('responseType', 'json');
    return this.http.get(`${environment.apim}GetReportSelectionDetails?roleid=${roleid}&timeperiodID=${timeperiodID}`,
     { responseType: 'json' });
  }

  GetDataAvailability(): Observable<any> {
    return this.http.get<any>(`${environment.apim}GetDataAvailability`);
  }

}
