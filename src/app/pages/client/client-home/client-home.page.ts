import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { BottomTabComponent } from "../../../components/bottom-tab/bottom-tab.component";
import { ProfessionalService } from 'src/app/_services/professional/professional.service';
import { OfficialService } from 'src/app/_services/official/official.service';
import { CustomTitlecasePipe } from "../../../core/pipes/custom-titlecase/custom-titlecase.pipe";
import { RegistryService } from 'src/app/_services/registry/registry.service';
import { AppointmentService } from 'src/app/_services/appointment/appointment.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.page.html',
  styleUrls: ['./client-home.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, BottomTabComponent, CustomTitlecasePipe]
})
export class ClientHomePage implements OnInit {

  constructor(private navCtrl : NavController , private professionalService : ProfessionalService, private officialService : OfficialService, private registryService : RegistryService, private appointmentService : AppointmentService ) { }


  consultants: any[] = [];
  officials: any[] = [];
  registries : any[] = [];
  appointment: any = null;
  professional : any;
  loading: boolean = true;

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user')!);

    this.professionalService.getAllProfessionalForm().subscribe(async(consultants:any)=>{
      this.consultants = consultants.slice(0, 5);
      this.officialService.getAllOfficials().subscribe(async(officials:any)=>{    
        this.officials = officials.slice(0, 5);  
        this.registryService.getAllRegistryLocations().subscribe(async(registryLocations:any)=>{
          this.registries = registryLocations.slice(0,5);
          this.appointmentService.getAllClientAppointments({ clientEmail: user.email }).subscribe((appointments: any) => {
            if (appointments && appointments.length > 0) {
              const ongoingAppointment = appointments.find(
                (appointment: any) => appointment.appointmentStatus === 'ongoing'
              );

              if (ongoingAppointment) {
                this.appointment = ongoingAppointment;

                this.professionalService.getProfessionalForm({ email: this.appointment.professionalEmail }).subscribe((prof: any) => {
                  this.professional = prof;
                  this.loading = false;
                });
              } else {
                this.loading = false; // No ongoing appointment
              }
            } else {
              this.loading = false; // No appointments at all
            }
          });
        })
      })
    })
  }

  toBrowse(){
    this.navCtrl.navigateRoot('/client-browse')
  }

  toOfficialBrowse(){
    this.navCtrl.navigateForward('/client-official-browse')
  }

  toRegistryBrowse(){
    this.navCtrl.navigateForward('/client-registry-browse')
  }

  toRegistryProfile(locationName : any){
    this.navCtrl.navigateForward(['/client-registry-profile'], {
          queryParams: { locationName }
    });
  }

  toOfficialProfile(id:any){
    this.navCtrl.navigateForward(['/client-official-profile'], {
        queryParams: { id }
    });
  }

  toProfessionalProfile(email : any){
    this.navCtrl.navigateForward(['/client-lawyer-detail'], {
      queryParams: { email }
    });
  }

  goToAppointment(){
    let appointmentId = this.appointment.appointmentId;
    this.navCtrl.navigateForward(['/client-appointment-detail'], {
      queryParams: { appointmentId }
    });
  }
}
