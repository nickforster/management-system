import {Component, OnInit} from '@angular/core';
import {faEnvelope, faHouse, faMessage, faQuoteRight, faSignature} from '@fortawesome/free-solid-svg-icons';
import {AuthenticationService} from "../../services/authentication.service";
import {UserService} from "../../services/user.service";
import {ContactService} from "../../services/contact.service";

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

  mail: Mail = {name: "", from: "", to: "", subject: "", message: ""}

  error = ''
  success = ''

  constructor(private userService: UserService, private authenticationService: AuthenticationService, private contactService: ContactService) {
  }

  ngOnInit(): void {
    this.authenticationService.authorise()
    this.loadData()
  }

  send() {
    if (this.mail.name === '' || this.mail.from === '' || this.mail.subject === '' || this.mail.message === '') {
      this.error = "Please fill in all fields"
      this.success = ""
      return
    }
    if (!new RegExp("^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-]+)(\\.[a-zA-Z]{2,5}){1,2}$").test(this.mail.from)) {
      this.error = "Pleas use a valid email"
      this.success = ""
      return
    }
    this.contactService.sendMail(this.mail).subscribe(() => {
      this.error = ""
      this.success = "The mail has been sent"
      this.clear()
    }, (err) => {
      this.success = ""
      this.error = err.error
    })
  }

  clear() {
    this.mail = {name: "", from: "", to: "nickforster23@gmail.com", subject: "", message: ""}
    this.error = ""
  }

  loadData() {
    this.userService.getUser().subscribe(res => {
      this.mail.name = JSON.parse(JSON.stringify(res)).username
      this.mail.from = JSON.parse(JSON.stringify(res)).email
      this.mail.name = this.mail.name.charAt(0).toUpperCase() + this.mail.name.slice(1)
    })
  }

}

interface Mail {
  name: string;
  from: string;
  to: string;
  subject: string;
  message: string;
}
