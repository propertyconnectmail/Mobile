import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {

  private apiUrl = `${environment.apiUrl}/professional/`;
  
    constructor(private http: HttpClient) {}
  
    postProfessionalForm(ProfessionalForm : any) {
      return this.http.post<any>(this.apiUrl+'register', ProfessionalForm)
    }
  
    getProfessionalForm(body: any) {
      return this.http.post<any>(this.apiUrl+'get', body)
    }


    getAllProfessionalForm() {
      return this.http.get<any>(this.apiUrl+'get/all/verified')
    }
  
    updateProfessionalForm(ProfessionalForm : any) {
      return this.http.post<any>(this.apiUrl+'update', ProfessionalForm)
    }
  
    updateProfilePicture(ProfessionalForm : any) {
      return this.http.post<any>(this.apiUrl+'update/picture', ProfessionalForm)
    }
  
    updateProfessionalPassword(passwordForm : any) {
      return this.http.post<any>(this.apiUrl+'update/pass', passwordForm)
    }

    updateForgotPassword(passwordForm : any) {
    return this.http.post<any>(this.apiUrl+'update/forgot/pass', passwordForm)
  }
}
