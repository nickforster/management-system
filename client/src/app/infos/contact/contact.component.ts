import { Component, OnInit } from '@angular/core';
import {faHouse, faSignature, faEnvelope, faQuoteRight, faMessage} from '@fortawesome/free-solid-svg-icons';
import {AuthenticationService} from "../../services/authentication.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css', '../infos.components.css']
})
export class ContactComponent implements OnInit {
  faHouse = faHouse
  faSignature = faSignature
  faEnvelope = faEnvelope
  faQuoteRight = faQuoteRight
  faMessage = faMessage

  mail: Mail = {username: "", email: "", subject: "", message: ""}

  constructor(private userService: UserService, private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.authenticationService.authorise()
    this.loadData()
  }

  send() {

  }

  clear() {
    this.mail = {username: "", email: "", subject: "", message: ""}
  }

  loadData() {
    this.userService.getUser().subscribe(res => {
      this.mail = JSON.parse(JSON.stringify(res))
      this.mail.username = this.mail.username.charAt(0).toUpperCase() + this.mail.username.slice(1)
    })
  }

}

interface Mail {
  username: string;
  email: string;
  subject: string;
  message: string;
}
