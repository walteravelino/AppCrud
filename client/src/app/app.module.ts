import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; // this for routing
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NavComponent } from './nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AddUserComponent } from './add-user/add-user.component';
import { MyDatePickerModule } from 'mydatepicker';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register',      component: RegistrationComponent },
  { path: 'dashboard',      component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'user/:id',      component: AddUserComponent, canActivate: [AuthGuard] },
  { path: 'user',      component: AddUserComponent, canActivate: [AuthGuard] },



  { path: '**', component: PageNotFoundComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    DashboardComponent,
    PageNotFoundComponent,
    NavComponent,
    AddUserComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true } // <-- debugging purposes only
    ),
    HttpClientModule,
    MyDatePickerModule

  ],
  providers: [AuthService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
