import {Component, OnInit} from '@angular/core';
import {faPenToSquare, faPlus, faSignature, faXmark} from "@fortawesome/free-solid-svg-icons";
import {CategoryService} from "../../services/category.service";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css', '../sub.component.css']
})
export class CategoriesComponent implements OnInit {
  // Fontawesome Icons
  faPlus = faPlus
  faPenToSquare = faPenToSquare
  faXMark = faXmark
  // in popUp
  faSignature = faSignature

  title: string = 'New Category'
  isNewCategory: boolean = true
  id: number | undefined
  name: string = '' // name of the category - ngmodel
  errorMessage = false

  currentCategoryToDelete: number = -1
  currentCategoryToUpdate: number = -1

  categories: Category[] = []

  constructor(private categoryService: CategoryService, private authenticationService: AuthenticationService) {
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

    if (id == -1) { // if a new category is being added
      this.title = 'New Category'
      this.name = ''
      this.isNewCategory = true
    } else { // if an existing category is being edited
      const currentCategory = this.categories[id]
      this.id = currentCategory.id
      this.title = `Edit ${currentCategory.name}`
      this.name = currentCategory.name
      this.isNewCategory = false
      this.currentCategoryToUpdate = this.categories[id].id
    }
  }

  openDeleteModal(id: number) {
    const modal: HTMLDialogElement | null = document.querySelector("#delete-instance-dialog")
    if (modal == null) return
    this.title = this.categories[id].name
    modal.showModal()
    modal.classList.add('open')
    this.currentCategoryToDelete = this.categories[id].id
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

  saveCategory() {
    if (this.name == '') {
      this.errorMessage = true
      return
    }

    if (this.isNewCategory) {
      this.categoryService.insertCategory(this.name)
    } else {
      this.categoryService.updateCategory(this.currentCategoryToUpdate, this.name)
    }
    this.errorMessage = false
    setTimeout(() => {
      this.loadData()
    }, 10)
    this.closeModal("#new-instance-dialog")
  }

  deleteCategory() {
    this.categoryService.deleteCategory(this.currentCategoryToDelete)
    setTimeout(() => {
      this.loadData()
    }, 10)
    this.closeModal("#delete-instance-dialog")
  }

  loadData() {
    this.categoryService.getAllCategories().subscribe(res => {
      this.categories = JSON.parse(JSON.stringify(res))
    })
  }
}

interface Category {
  id: number;
  name: string;
}
