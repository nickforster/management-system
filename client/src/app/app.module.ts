import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from "@angular/common/http";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {AutosizeModule} from 'ngx-autosize';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SettingsComponent } from './settings/settings.component';
import { FoodsComponent } from './settings/foods/foods.component';
import { AllergiesComponent } from './settings/allergies/allergies.component';
import { CategoriesComponent } from './settings/categories/categories.component';
import { TablesComponent } from './settings/tables/tables.component';
import { AccountComponent } from './settings/account/account.component';
import { NoticeComponent } from './legal/notice/notice.component';
import { PrivacyComponent } from './legal/privacy/privacy.component';
import { FooterComponent } from './footer/footer.component';
import { SupportComponent } from './infos/support/support.component';
import { ContactComponent } from './infos/contact/contact.component';
import { LogsComponent } from './logs/logs.component';
import { OrderComponent } from './home/order/order.component';
import { BillComponent } from './home/bill/bill.component';
import { HistoryComponent } from './home/history/history.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    SettingsComponent,
    FoodsComponent,
    AllergiesComponent,
    CategoriesComponent,
    TablesComponent,
    AccountComponent,
    NoticeComponent,
    PrivacyComponent,
    FooterComponent,
    SupportComponent,
    ContactComponent,
    LogsComponent,
    OrderComponent,
    BillComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    AutosizeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
