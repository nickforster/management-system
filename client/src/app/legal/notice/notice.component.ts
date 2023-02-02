import {Component, OnInit} from '@angular/core';
import {faHouse} from '@fortawesome/free-solid-svg-icons';
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css', '../legal.components.css']
})
export class NoticeComponent implements OnInit {
  faHouse = faHouse

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.authenticationService.authorise()
  }

}
