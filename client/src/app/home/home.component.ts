import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import { faGear } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  faGear = faGear

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.authenticationService.authorise()
  }

}
