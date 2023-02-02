import { Component, OnInit } from '@angular/core';
import {faHouse} from '@fortawesome/free-solid-svg-icons';
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css', '../legal.components.css']
})
export class PrivacyComponent implements OnInit {
  faHouse = faHouse

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.authenticationService.authorise()
  }

}
