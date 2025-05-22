import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = `${environment.apiUrl}/client/`;

  constructor(private http: HttpClient) {}

  postClientForm(clientForm : any) {
    return this.http.post<any>(this.apiUrl+'register', clientForm)
  }

  getClientForm(body: any) {
    return this.http.post<any>(this.apiUrl+'get', body)
  }

  updateClientForm(clientForm : any) {
    return this.http.post<any>(this.apiUrl+'update', clientForm)
  }

  updateProfilePicture(clientForm : any) {
    return this.http.post<any>(this.apiUrl+'update/picture', clientForm)
  }

  updateClientPassword(passwordForm : any) {
    return this.http.post<any>(this.apiUrl+'update/pass', passwordForm)
  }



  getClientPaymentMethods(body : any) {
    return this.http.post<any>(this.apiUrl+'get/all/cards', body)
  }

  getCardDetails(body : any) {
    return this.http.post<any>(this.apiUrl+'get/card', body)
  }

  deleteClientPaymentMethod(body : any) {
    return this.http.post<any>(this.apiUrl+'delete/card', body)
  }

  updateClientPaymentMethod(body : any) {
    return this.http.post<any>(this.apiUrl+'update/card', body)
  }

  addClientPaymentMethod(body : any) {
    return this.http.post<any>(this.apiUrl+'add/card', body)
  }
}
