import { Component, OnInit } from '@angular/core';
import {faUser, faKey, faEnvelope, faEye, faEyeSlash, faSpinner} from '@fortawesome/free-solid-svg-icons';
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
  registering = false
  error = ''

  faUser = faUser;
  faKey = faKey;
  faEnvelope = faEnvelope;
  faEye = faEye;
  faSpinner = faSpinner

  constructor(private httpClient: HttpClient,
              public router: Router,
              private authenticationService: AuthenticationService
  ) {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.register()
      }
    })
  }

  ngOnInit(): void {
  }

  register() {
    if (this.username != '' && this.email != '' && this.password != '') {
      this.registering = true
      this.authenticationService.register(this.username, this.email, this.password).subscribe(
        (res: any) => {
          localStorage.setItem('token', res.token);
          this.router.navigateByUrl('/');
        }, (err) => {
          this.error = err.error
          this.registering = false
        }
      );
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
