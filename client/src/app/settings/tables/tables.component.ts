import {Component, OnInit} from '@angular/core';
import {faArrowsUpDown, faPenToSquare, faPlus, faSignature, faXmark} from "@fortawesome/free-solid-svg-icons";
import {TableService} from "../../services/table.service";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css', '../sub.component.css']
})
export class TablesComponent implements OnInit {
  // Fontawesome Icons
  faPlus = faPlus
  faPenToSquare = faPenToSquare
  faXMark = faXmark
  // in popUp
  faSignature = faSignature
  faArrowsUpDown = faArrowsUpDown

  title: string = 'New Table'
  isNewTable: boolean = true
  id: number | undefined
  name: string = '' // name of the table - ngmodel
  amountPeople: number | string = '' // amount of people maximal on the table - ngmodel
  errorMessage = false

  currentTableToDelete: number = -1
  currentTableToUpdate: number = -1

  tables: Table[] = []

  constructor(private tableService: TableService, private authenticationService: AuthenticationService) {
    // makes animation for the next opening visible again
    let body = document.querySelector('body')
    if (body != null) {
      body.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          this.closeModal("#new-instance-dialog")
          this.closeModal("#delete-instance-dialog")
        }
      })
    }
  }

  ngOnInit(): void {
    this.authenticationService.authorise()
    this.loadData()
  }

  openNewModal(id: number = -1) {
    const modal: HTMLDialogElement | null = document.querySelector("#new-instance-dialog")
    if (modal == null) return
    modal.showModal()
    modal.classList.add('open')
    this.errorMessage = false

    if (id == -1) { // if a new table is being added
      this.title = 'New Table'
      this.name = ''
      this.amountPeople = ''
      this.isNewTable = true
    } else { // if an existing table is being edited
      const currentTable = this.tables[id]
      this.id = currentTable.id
      this.title = `Edit ${currentTable.name}`
      this.name = currentTable.name
      this.amountPeople = currentTable.amountPeople
      this.isNewTable = false
      this.currentTableToUpdate = this.tables[id].id
    }
  }

  openDeleteModal(id: number) {
    const modal: HTMLDialogElement | null = document.querySelector("#delete-instance-dialog")
    if (modal == null) return
    this.title = this.tables[id].name
    modal.showModal()
    modal.classList.add('open')
    this.currentTableToDelete = this.tables[id].id
  }

  closeModal(selector: string) {
    const modal: HTMLDialogElement | null = document.querySelector(selector)
    if (modal != null) {
      modal.classList.remove('open')
      setTimeout(() => {
        modal.close()
      }, 250)
    }
  }

  saveTable() {
    if (this.name == '' || this.amountPeople == '') {
      this.errorMessage = true
      return
    }

    if (this.isNewTable) {
      this.tableService.insertTable(this.name, Number(this.amountPeople))
    } else {
      this.tableService.updateTable(this.currentTableToUpdate, this.name, Number(this.amountPeople))
    }
    this.errorMessage = false
    setTimeout(() => {
      this.loadData()
    }, 10)
    this.closeModal("#new-instance-dialog")
  }

  deleteTable() {
    this.tableService.deleteTable(this.currentTableToDelete)
    setTimeout(() => {
      this.loadData()
    }, 10)
    this.closeModal("#delete-instance-dialog")
  }

  loadData() {
    this.tableService.getAllTables().subscribe(res => {
      this.tables = JSON.parse(JSON.stringify(res))
    })
  }
}

interface Table {
  id: number;
  name: string;
  amountPeople: number;
}
