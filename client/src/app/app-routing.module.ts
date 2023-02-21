import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {SettingsComponent} from "./settings/settings.component";
import {NoticeComponent} from "./legal/notice/notice.component";
import {PrivacyComponent} from "./legal/privacy/privacy.component";
import {SupportComponent} from "./infos/support/support.component";
import {ContactComponent} from "./infos/contact/contact.component";
import {LogsComponent} from "./logs/logs.component";

const routes: Routes = [
  { path: 'support', component: SupportComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'legalNotice', component: NoticeComponent},
  { path: 'dataPrivacy', component: PrivacyComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logs', component: LogsComponent},
  { path: 'settings', component: SettingsComponent },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
