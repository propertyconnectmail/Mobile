import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OfficialService {

  private apiUrl = `${environment.apiUrl}/official/`;

  constructor(private http : HttpClient) { }

  getOfficial(body: any) {
    return this.http.post<any>(this.apiUrl+'get', body)
  }


  getAllOfficials() {
    return this.http.get<any>(this.apiUrl+'get/all')
  }
}
