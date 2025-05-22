// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { firstLaunchGuard } from './_guards/firstLaunch/first-launch.guard';
import { clientGuard } from './_guards/client/client.guard';
import { professionalGuard } from './_guards/professional/professional.guard';
import { authGuard } from './_guards/auth/auth.guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'splash',loadChildren: () => import('./pages/splash/splash-routing.module').then((m) => m.splashRoutes)
  },
  {
    path: 'selection',
    loadComponent: () => import('./pages/selection/selection.page').then( m => m.SelectionPage),canActivate: [firstLaunchGuard]
  },
  {
    path: 'onboarding-client',
    loadComponent: () => import('./pages/onboarding-client/onboarding-client.page').then( m => m.OnboardingClientPage),canActivate: [firstLaunchGuard]
  },
  {
    path: 'onboarding-professional',
    loadComponent: () => import('./pages/onboarding-professional/onboarding-professional.page').then( m => m.OnboardingProfessionalPage),canActivate: [firstLaunchGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage),canActivate: [authGuard]
  },
  {
    path: 'register-professional',
    loadComponent: () => import('./pages/register-professional/register-professional.page').then( m => m.RegisterProfessionalPage),canActivate: [authGuard]
  },
  {
    path: 'login-professional',
    loadComponent: () => import('./pages/login-professional/login-professional.page').then( m => m.LoginProfessionalPage),canActivate: [authGuard]
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
  },
  {
    path: 'forgot-password-confirmation',
    loadComponent: () => import('./pages/forgot-password-confirmation/forgot-password-confirmation.page').then( m => m.ForgotPasswordConfirmationPage)
  },
  {
    path: 'client-home',
    loadComponent: () => import('./pages/client/client-home/client-home.page').then( m => m.ClientHomePage),canActivate: [clientGuard]
  },
  {
    path: 'client-browse',
    loadComponent: () => import('./pages/client/client-browse/client-browse.page').then( m => m.ClientBrowsePage),canActivate: [clientGuard]
  },
  {
    path: 'client-lawyer-detail',
    loadComponent: () => import('./pages/client/client-lawyer-detail/client-lawyer-detail.page').then( m => m.ClientLawyerDetailPage),canActivate: [clientGuard]
  },
  {
    path: 'client-set-appointment-date',
    loadComponent: () => import('./pages/client/client-set-appointment-date/client-set-appointment-date.page').then( m => m.ClientSetAppointmentDatePage),canActivate: [clientGuard]
  },
  {
    path: 'client-payment-page',
    loadComponent: () => import('./pages/client/client-payment-page/client-payment-page.page').then( m => m.ClientPaymentPagePage),canActivate: [clientGuard]
  },
  {
    path: 'client-payment-success',
    loadComponent: () => import('./pages/client/client-payment-success/client-payment-success.page').then( m => m.ClientPaymentSuccessPage),canActivate: [clientGuard]
  },
  {
    path: 'client-all-appointments',
    loadComponent: () => import('./pages/client/client-all-appointments/client-all-appointments.page').then( m => m.ClientAllAppointmentsPage),canActivate: [clientGuard]
  },
  {
    path: 'client-appointment-detail',
    loadComponent: () => import('./pages/client/client-appointment-detail/client-appointment-detail.page').then( m => m.ClientAppointmentDetailPage),canActivate: [clientGuard]
  },
  {
    path: 'client-notifications',
    loadComponent: () => import('./pages/client/client-notifications/client-notifications.page').then( m => m.ClientNotificationsPage),canActivate: [clientGuard]
  },
  {
    path: 'client-profile',
    loadComponent: () => import('./pages/client/client-profile/client-profile.page').then( m => m.ClientProfilePage),canActivate: [clientGuard]
  },
  {
    path: 'client-edit-profile',
    loadComponent: () => import('./pages/client/client-edit-profile/client-edit-profile.page').then( m => m.ClientEditProfilePage),canActivate: [clientGuard]
  },
  {
    path: 'client-change-password',
    loadComponent: () => import('./pages/client/client-change-password/client-change-password.page').then( m => m.ClientChangePasswordPage),canActivate: [clientGuard]
  },
  {
    path: 'client-payment-methods',
    loadComponent: () => import('./pages/client/client-payment-methods/client-payment-methods.page').then( m => m.ClientPaymentMethodsPage),canActivate: [clientGuard]
  },
  {
    path: 'client-payment-crud',
    loadComponent: () => import('./pages/client/client-payment-crud/client-payment-crud.page').then( m => m.ClientPaymentCrudPage),canActivate: [clientGuard]
  },
  {
    path: 'client-payment-update',
    loadComponent: () => import('./pages/client/client-payment-update/client-payment-update.page').then( m => m.ClientPaymentUpdatePage),canActivate: [clientGuard]
  },
  {
    path: 'client-appointment-review',
    loadComponent: () => import('./pages/client/client-appointment-review/client-appointment-review.page').then( m => m.ClientAppointmentReviewPage),canActivate: [clientGuard]
  },
  {
    path: 'client-eligibility',
    loadComponent: () => import('./pages/client/client-eligibility/client-eligibility.page').then( m => m.ClientEligibilityPage),canActivate: [clientGuard]
  },
  {
    path: 'client-official-browse',
    loadComponent: () => import('./pages/client/client-official-browse/client-official-browse.page').then( m => m.ClientOfficialBrowsePage),canActivate: [clientGuard]
  },
  {
    path: 'client-registry-browse',
    loadComponent: () => import('./pages/client/client-registry-browse/client-registry-browse.page').then( m => m.ClientRegistryBrowsePage),canActivate: [clientGuard]
  },
  {
    path: 'client-registry-profile',
    loadComponent: () => import('./pages/client/client-registry-profile/client-registry-profile.page').then( m => m.ClientRegistryProfilePage),canActivate: [clientGuard]
  },
  {
    path: 'client-official-profile',
    loadComponent: () => import('./pages/client/client-official-profile/client-official-profile.page').then( m => m.ClientOfficialProfilePage),canActivate: [clientGuard]
  },
  {
    path: 'professional-home',
    loadComponent: () => import('./pages/professional/professional-home/professional-home.page').then( m => m.ProfessionalHomePage),canActivate: [professionalGuard]
  },
  {
    path: 'professional-profile',
    loadComponent: () => import('./pages/professional/professional-profile/professional-profile.page').then( m => m.ProfessionalProfilePage),canActivate: [professionalGuard]
  },
  {
    path: 'professional-edit-profile',
    loadComponent: () => import('./pages/professional/professional-edit-profile/professional-edit-profile.page').then( m => m.ProfessionalEditProfilePage),canActivate: [professionalGuard]
  },
  {
    path: 'professional-change-password',
    loadComponent: () => import('./pages/professional/professional-change-password/professional-change-password.page').then( m => m.ProfessionalChangePasswordPage),canActivate: [professionalGuard]
  },
  {
    path: 'professional-all-reviews',
    loadComponent: () => import('./pages/professional/professional-all-reviews/professional-all-reviews.page').then( m => m.ProfessionalAllReviewsPage),canActivate: [professionalGuard]
  },
  {
    path: 'professional-certifications',
    loadComponent: () => import('./pages/professional/professional-certifications/professional-certifications.page').then( m => m.ProfessionalCertificationsPage),canActivate: [professionalGuard]
  },
  {
    path: 'professional-appointment-detail',
    loadComponent: () => import('./pages/professional/professional-appointment-detail/professional-appointment-detail.page').then( m => m.ProfessionalAppointmentDetailPage),canActivate: [professionalGuard]
  },
  {
    path: 'email-code',
    loadComponent: () => import('./pages/email-code/email-code.page').then( m => m.EmailCodePage)
  }
];
