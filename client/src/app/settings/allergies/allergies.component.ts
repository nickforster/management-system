import {Component, OnInit} from '@angular/core';
import {faPenToSquare, faPlus, faSignature, faXmark} from "@fortawesome/free-solid-svg-icons";
import {AllergyService} from "../../services/allergy.service";
import {AuthenticationService} from "../../services/authentication.service";

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

  allergies: Allergy[] = []

  constructor(private allergyService: AllergyService, private authenticationService: AuthenticationService) {
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
      this.allergyService.insertAllergy(this.name)
    } else {
      this.allergyService.updateAllergy(this.currentAllergyToUpdate, this.name)
    }
    this.errorMessage = false
    setTimeout(() => {
      this.loadData()
    }, 10)
    this.closeModal("#new-instance-dialog")
  }

  deleteAllergy() {
    this.allergyService.deleteAllergy(this.currentAllergyToDelete)
    setTimeout(() => {
      this.loadData()
    }, 10)
    this.closeModal("#delete-instance-dialog")
  }

  loadData() {
    this.allergyService.getAllAllergies().subscribe(res => {
      this.allergies = JSON.parse(JSON.stringify(res))
    })
  }
}

interface Allergy {
  id: number;
  name: string
}

