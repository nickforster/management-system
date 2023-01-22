import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {faGear} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  faGear = faGear
  name = "User"

  constructor(private authenticationService: AuthenticationService) {
    let token = localStorage.getItem("token")
    if (token !== null) {
      this.name = JSON.parse(atob(token.split('.')[1])).username
    }
  }

  ngOnInit(): void {
    this.authenticationService.authorise()
  }

  logout() {
    this.authenticationService.logout()
  }

}
