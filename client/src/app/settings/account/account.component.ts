import {Component, OnInit} from '@angular/core';
import {faEnvelope, faEye, faEyeSlash, faKey, faUser} from '@fortawesome/free-solid-svg-icons';
import {AuthenticationService} from "../../services/authentication.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  faEye = faEye
  faKey = faKey
  faUser = faUser
  faEnvelope = faEnvelope

  user: User = {username: "username", email: "email", password: ""}

  constructor(private userService: UserService, private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.authenticationService.authorise()
    this.loadData()
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

  updateUser() {
    this.userService.updateUser(this.user.username, this.user.email, this.user.password)
  }

  loadData() {
    this.userService.getUser().subscribe(res => {
      this.user = JSON.parse(JSON.stringify(res))
    })
  }
}

interface User {
  username: string;
  email: string;
  password: string;
}
