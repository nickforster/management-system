import {Component, OnInit} from '@angular/core';
import {faEye, faEyeSlash, faKey, faSpinner, faUser} from '@fortawesome/free-solid-svg-icons';
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
  loggingIn = false
  error = ''

  faUser = faUser;
  faKey = faKey;
  faEye = faEye;
  faSpinner = faSpinner

  constructor(private httpClient: HttpClient,
              public router: Router,
              private authenticationService: AuthenticationService
  ) {
    document.addEventListener('keydown', (e) => {
      let url = window.location.href
      if (e.key === 'Enter' && (url.endsWith("login") || url.endsWith("register"))) {
        this.login()
      }
    })
  }

  ngOnInit(): void {
  }

  login() {
    if (this.username != '' && this.password != '') {
      this.loggingIn = true
      this.authenticationService.login(this.username, this.password).subscribe(
        (res: any) => {
          localStorage.setItem('token', res.token);
          this.router.navigateByUrl('/');
        }, (err) => {
          this.error = err.error
          this.loggingIn = false
        }
      )

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
