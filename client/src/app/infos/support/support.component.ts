import { Component, OnInit } from '@angular/core';
import {faHouse} from '@fortawesome/free-solid-svg-icons';
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css', '../infos.components.css']
})
export class SupportComponent implements OnInit {
  faHouse = faHouse

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.authenticationService.authorise()
  }

}
