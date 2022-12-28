import { Component, OnInit } from '@angular/core';
import {faEye, faEyeSlash, faKey, faUser, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  faEye = faEye
  faEyeSlash = faEyeSlash
  faKey = faKey
  faUser = faUser
  faEnvelope = faEnvelope

  username = ""
  password = ""
  email = ""

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.authenticationService.authorise()
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
