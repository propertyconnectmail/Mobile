import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegistryService {

  private apiUrl = `${environment.apiUrl}/registry/`;

  constructor(private http : HttpClient) { }

  getRegistryLocation(body: any) {
    return this.http.post<any>(this.apiUrl+'get', body)
  }


  getAllRegistryLocations() {
    return this.http.get<any>(this.apiUrl+'get/all')
  }
}
