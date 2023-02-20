import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {faGear, faPlay, faPlus, faPenToSquare, faMoneyBill, faClockRotateLeft} from '@fortawesome/free-solid-svg-icons';
import {TableService} from "../services/table.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  faGear = faGear
  faPlay = faPlay
  faPlus = faPlus
  faPenToSquare = faPenToSquare
  faMoneyBill = faMoneyBill
  faClockRotateLeft = faClockRotateLeft
  name = "User"
  active: boolean[] = []
  tables: Table[] = []

  constructor(private authenticationService: AuthenticationService, private tableService: TableService) {
    let token = localStorage.getItem("token")
    if (token !== null) {
      this.name = JSON.parse(atob(token.split('.')[1])).username
    }
  }

  ngOnInit(): void {
    this.authenticationService.authorise()
    this.loadData()
  }

  loadData() {
    this.tableService.getAllTables().subscribe(res => {
      this.tables = JSON.parse(JSON.stringify(res))
      for (let i = 0; i < this.tables.length; i++) {
        this.active[i] = true // TODO make database request to get correct value
      }
    })
  }
}

interface Table {
  id: number;
  name: string;
  amountPeople: number;
}
