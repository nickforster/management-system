import { Component, OnInit } from '@angular/core';
import {faEye, faEyeSlash, faKey, faUser} from '@fortawesome/free-solid-svg-icons';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = ''
  password = ''
  object: any

  faUser = faUser;
  faKey = faKey;
  faEye = faEye;

  constructor(private httpClient: HttpClient,
              public router: Router,
              private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
  }

  login() {
    if (this.username != '' && this.password != '') {
      this.authenticationService.login(this.username, this.password)
    }
  }

  changeVisibility() {
    if (this.faEye === faEye) {
      this.faEye = faEyeSlash;
      // @ts-ignore
      document.getElementById("password").type = "text"

    } else {
      this.faEye = faEye;
      // @ts-ignore
      document.getElementById("password").type = "password"
    }
  }

}
