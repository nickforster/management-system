import {Component, OnInit} from '@angular/core';
import {faPenToSquare, faPlus, faSignature, faXmark} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-allergies',
  templateUrl: './allergies.component.html',
  styleUrls: ['./allergies.component.css', '../sub.component.css']
})
export class AllergiesComponent implements OnInit {
  // Fontawesome Icons
  faPlus = faPlus
  faPenToSquare = faPenToSquare
  faXMark = faXmark
  // in popUp
  faSignature = faSignature

  title: string = 'New Allergy'
  isNewAllergy: boolean = true
  id: number | undefined
  name: string = '' // name of the allergy - ngmodel
  errorMessage = false

  currentAllergyToDelete: number = -1
  currentAllergyToUpdate: number = -1

  allergies: Allergy[] = [
    {
      id: 0,
      name: "vegan"
    },
    {
      id: 2,
      name: "vegetarian"
    },
    {
      id: 3,
      name: "without nuts"
    },
    {
      id: 4,
      name: "without lactose"
    },
    {
      id: 5,
      name: "without gluten"
    },
  ]

  constructor() {
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
    this.loadData()
  }

  openNewModal(id: number = -1) {
    const modal: HTMLDialogElement | null = document.querySelector("#new-instance-dialog")
    if (modal == null) return
    modal.showModal()
    modal.classList.add('open')
    this.errorMessage = false

    if (id == -1) { // if a new allergy is being added
      this.title = 'New Allergy'
      this.name = ''
      this.isNewAllergy = true
    } else { // if an existing allergy is being edited
      const currentAllergy = this.allergies[id]
      this.id = currentAllergy.id
      this.title = `Edit ${currentAllergy.name}`
      this.name = currentAllergy.name
      this.isNewAllergy = false
      this.currentAllergyToUpdate = this.allergies[id].id
    }
  }

  openDeleteModal(id: number) {
    const modal: HTMLDialogElement | null = document.querySelector("#delete-instance-dialog")
    if (modal == null) return
    this.title = this.allergies[id].name
    modal.showModal()
    modal.classList.add('open')
    this.currentAllergyToDelete = this.allergies[id].id
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

  saveAllergy() {
    if (this.name == '') {
      this.errorMessage = true
      return
    }

    if (this.isNewAllergy) {
      // TODO make request addAllergy with name=this.title
    } else {
      // TODO make request updateAllergy with id = this.currentAllergyToUpdate, name=this.title
    }
    this.errorMessage = false
    this.closeModal("#new-instance-dialog")
    this.loadData()
  }

  deleteAllergy() {
    // TODO make request deleteAllergy with id = this.currentAllergyToDelete
    this.loadData()
    this.closeModal("#delete-instance-dialog")
  }

  loadData() {
    // TODO make request to load allergies from DB into this.allergies
  }
}

interface Allergy {
  id: number;
  name: string
}

