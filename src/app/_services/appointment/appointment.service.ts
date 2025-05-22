import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl = `${environment.apiUrl}/appointment/`;
  
    constructor(private http: HttpClient) {}
  
    postAppointmentForm(AppointmentForm : any) {
      console.log(this.apiUrl)
      return this.http.post<any>(this.apiUrl+'create', AppointmentForm)
    }
  
    getAllClientAppointments(body: any) {
      return this.http.post<any>(this.apiUrl+'get/client/appointments', body)
    }

    getAllProfessionalAppointments(body: any) {
      return this.http.post<any>(this.apiUrl+'get/professional/appointments', body)
    }

    getAppointment(body: any) {
      return this.http.post<any>(this.apiUrl+'get/appointment', body)
    }

    updateAppointment(body: any) {
      return this.http.post<any>(this.apiUrl+'update', body)
    }

    updateAppointmentClientFiles(body: any) {
      return this.http.post<any>(this.apiUrl+'update/client/files', body)
    }

    updateAppointmentProfessionalFiles(body: any) {
      return this.http.post<any>(this.apiUrl+'update/professional/files', body)
    }


    // getAllProfessionalForm() {
    //   return this.http.get<any>(this.apiUrl+'get/all/verified')
    // }
  
    // updateProfessionalForm(ProfessionalForm : any) {
    //   return this.http.post<any>(this.apiUrl+'update', ProfessionalForm)
    // }
  
    // updateProfilePicture(ProfessionalForm : any) {
    //   return this.http.post<any>(this.apiUrl+'update/picture', ProfessionalForm)
    // }
  
    // updateProfessionalPassword(passwordForm : any) {
    //   return this.http.post<any>(this.apiUrl+'update/pass', passwordForm)
    // }
}
