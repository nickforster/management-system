import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {faClockRotateLeft, faGear, faMoneyBill, faPenToSquare, faPlay, faPlus} from '@fortawesome/free-solid-svg-icons';
import {TableService} from "../services/table.service";
import {OrderService} from "../services/order.service";

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
  activeOrders: Order[] = []
  currentTableHistory: Order[] = []
  newOrder = false
  editOrder = false
  showBill = false
  showHistory = false

  constructor(private authenticationService: AuthenticationService,
              private tableService: TableService,
              private orderService: OrderService) {
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

      this.orderService.getActiveOrders().subscribe(res => {
        this.activeOrders = JSON.parse(JSON.stringify(res))

        for (let i = 0; i < this.activeOrders.length; i++) {
          for (let j = 0; j < this.tables.length; j++) {
            if (this.activeOrders[i].tableId === this.tables[j].id) {
              this.active[j] = true
              break;
            }
          }
        }
      })
    })
  }

  start(index: number) {
    this.active[index] = true
    this.orderService.insertOrder(this.tables[index].id, false)
  }

  history(index: number) {
    this.orderService.getOrdersOfTable(this.tables[index].id).subscribe((res) => {
      this.currentTableHistory = JSON.parse(JSON.stringify(res))
    })
    this.showHistory = true
    // TODO show the history of this table
  }

  add(index: number) {
    this.newOrder = true
    // TODO show modal to add food
  }

  edit(index: number) {
    this.editOrder = true
    // TODO show modal with foods of current order to edit
  }

  bill(index: number) {
    this.showBill = true
    // TODO show bill of order and make payment etc.
    // TODO finish order in database and add set it complete
    this.active[index] = false
  }
}

interface Table {
  id: number;
  name: string;
  amountPeople: number;
}

interface Order {
  id: number;
  tableId: number;
  complete: boolean;
}
