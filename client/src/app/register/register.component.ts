import { Component, OnInit } from '@angular/core';
import {faUser, faKey, faEnvelope, faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  username = ''
  email = ''
  password = ''

  error = false

  faUser = faUser;
  faKey = faKey;
  faEnvelope = faEnvelope;
  faEye = faEye;

  constructor(private httpClient: HttpClient,
              public router: Router,
              private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  register() {
    if (this.username != '' && this.email != '' && this.password != '') {
      this.authenticationService.register(this.username, this.email, this.password)
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
