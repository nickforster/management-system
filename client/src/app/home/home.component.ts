import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {faClockRotateLeft, faGear, faMoneyBill, faPenToSquare, faPlay, faPlus} from '@fortawesome/free-solid-svg-icons';
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
        this.active[i] = false // TODO make database request to get correct value
      }
    })
  }

  start(index: number) {
    this.active[index] = true
    // TODO create order in database and set table to active
  }

  history(index: number) {
    // TODO make request for history of this table
    // TODO show the history of this table
  }

  add(index: number) {
    // TODO show modal to add food
  }

  edit(index: number) {
    // TODO show modal with foods of current order to edit
  }

  bill(index: number) {
    // TODO show bill of order and make payment etc.
    // TODO finish order in database and add it to history
    this.active[index] = false
  }
}

interface Table {
  id: number;
  name: string;
  amountPeople: number;
}
