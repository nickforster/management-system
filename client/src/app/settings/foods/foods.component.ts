import {Component, OnInit} from '@angular/core';
import {faBars, faPenToSquare, faPlus, faSignature, faTag, faXmark} from '@fortawesome/free-solid-svg-icons';
import {FoodService} from "../../services/food.service";
import {AllergyService} from "../../services/allergy.service";
import {CategoryService} from "../../services/category.service";

@Component({
  selector: 'app-foods',
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.css', '../sub.component.css'],
})
export class FoodsComponent implements OnInit {
  // Fontawesome Icons
  faPlus = faPlus
  faPenToSquare = faPenToSquare
  faXMark = faXmark
  // in popUp
  faSignature = faSignature
  faTag = faTag
  faBars = faBars

  selectedFood: number | undefined // displays the other infos of the food
  sortBy: string = 'Sort by category'

  title: string = 'New Food'
  isNewFood: boolean = true
  id: number | undefined
  name: string = '' // name of the food - ngmodel
  price: number | string = '' // price of the food - ngmodel
  selectedCategory: string = '' // name of the selected category - ngmodel
  selectedAllergies: boolean[] = []

  errorMessage = false
  currentFoodToDelete: number = -1
  currentFoodToUpdate: number = -1

  // variables to fill from the DB
  allFoods: Food[] = [
    {
      id: 0,
      name: "pizza margherita",
      category: 1,
      price: 16.5,
      allergies: [2, 3]
    },
    {
      id: 1,
      name: "pizza diavola",
      category: 1,
      price: 19.5,
      allergies: [3]
    },
    {
      id: 3,
      name: "pizza hawaii",
      category: 1,
      price: 19,
      allergies: [3]
    },
    {
      id: 4,
      name: "pizza prosciutto",
      category: 1,
      price: 18.5,
      allergies: [3]
    },
    {
      id: 5,
      name: "spaghetti carbonara",
      category: 2,
      price: 17,
      allergies: [3]
    },
    {
      id: 6,
      name: "fusili pomodoro",
      category: 2,
      price: 16,
      allergies: [0, 2, 3, 4]
    },
    {
      id: 7,
      name: "spaghetti bolognaise",
      category: 2,
      price: 19,
      allergies: [3, 4]
    },
    {
      id: 9,
      name: "steak with fries",
      category: 3,
      price: 22,
      allergies: [3, 4]
    },
    {
      id: 10,
      name: "ratatouille",
      category: 3,
      price: 14,
      allergies: [0, 2, 3, 4, 5]
    },
    {
      id: 12,
      name: "water",
      category: 4,
      price: 2,
      allergies: [0, 2, 3, 4, 5]
    },
    {
      id: 13,
      name: "coke",
      category: 4,
      price: 3.5,
      allergies: [0, 2, 3, 4, 5]
    },
    {
      id: 14,
      name: "beer",
      category: 6,
      price: 4.5,
      allergies: [0, 2, 3, 4, 5]
    },
    {
      id: 15,
      name: "wine",
      category: 6,
      price: 9,
      allergies: [0, 2, 3, 4, 5]
    },
  ]
  categories: Category[] = [
    {
      id: 1,
      name: "pizza"
    },
    {
      id: 2,
      name: "pasta"
    },
    {
      id: 3,
      name: "other foot"
    },
    {
      id: 4,
      name: "non-alcoholic drinks"
    },
    {
      id: 6,
      name: "alcoholic drinks"
    },
  ]
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

  // variable with the foods, that are currently displayed
  foods: Food[] = []
  // variable for the allergies in the show details section
  selectedAllergiesString: String[] = []

  constructor(
    private foodService: FoodService,
    private allergyService: AllergyService,
    private categoryService: CategoryService
  ) {
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
    this.sortByChange('Sort by category')
  }

  sortByChange(category: string) {
    if (category === 'Sort by category') {
      this.foods = this.allFoods
      return
    }
    this.foods = []
    for (const food of this.allFoods) {
      let item = this.categories.find(i => i.id == food.category)
      if (item !== undefined && item.name === category) {
        this.foods.push(food)
      }
    }
  }

  showDetails(index: number) {
    if (this.selectedFood === index) {
      this.selectedFood = undefined
    } else {
      this.selectedFood = index

      const activeCategory = this.categories.find(i => i.id == this.foods[index].category)
      if (activeCategory !== undefined) {
        this.selectedCategory = activeCategory.name
      }

      this.selectedAllergiesString = []
      for (let i = 0; i < this.allergies.length; i++) {
        if (this.foods[index].allergies !== null) {
          if (this.foods[index].allergies.includes(this.allergies[i].id)) {
            this.selectedAllergiesString[i] = this.allergies[i].name
          }
        }
      }
    }
  }

  openNewModal(id: number = -1) {
    const modal: HTMLDialogElement | null = document.querySelector("#new-instance-dialog")
    if (modal == null) return
    modal.showModal()
    modal.classList.add('open')
    this.errorMessage = false

    if (id == -1) { // if a new food is being added
      this.title = 'New Food'
      this.name = ''
      this.price = ''
      this.selectedCategory = this.categories[0].name
      this.selectedAllergies = []
      this.isNewFood = true
    } else { // if an existing food is being edited
      const currentFood = this.foods[id]
      this.id = currentFood.id
      this.title = `Edit ${currentFood.name}`
      this.name = currentFood.name
      this.price = currentFood.price
      // get the correct selected category
      const activeCategory = this.categories.find(i => i.id == currentFood.category)
      if (activeCategory !== undefined) {
        this.selectedCategory = activeCategory.name
      }
      // get the correct selected allergies
      this.selectedAllergies = []
      for (let i = 0; i < this.allergies.length; i++) {
        if (currentFood.allergies.includes(this.allergies[i].id)) {
          this.selectedAllergies[i] = true
        }
      }
      this.isNewFood = false
      this.currentFoodToUpdate = this.foods[id].id
    }
  }

  openDeleteModal(id: number) {
    const modal: HTMLDialogElement | null = document.querySelector("#delete-instance-dialog")
    if (modal == null) return
    this.title = this.foods[id].name
    modal.showModal()
    modal.classList.add('open')
    this.currentFoodToDelete = this.foods[id].id
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

  saveFood() {
    if (this.name == '' || this.price == '') {
      this.errorMessage = true
      return
    }
    let selectedAllergiesIds: number[] = []
    for (let i = 0; i < this.selectedAllergies.length; i++) {
      if (this.selectedAllergies[i]) {
        selectedAllergiesIds.push(this.allergies[i].id)
      }
    }
    if (this.isNewFood) {
      const activeCategory = this.categories.find(i => i.name == this.selectedCategory)
      if (activeCategory !== undefined) {
        this.foodService.insertFood(this.name, Number(this.price), activeCategory.id, selectedAllergiesIds)
      }
    } else {
      this.foodService.updateFood(this.currentFoodToUpdate, this.name, Number(this.price), this.categories[Number(this.selectedCategory)].id, selectedAllergiesIds)
    }
    this.errorMessage = false
    setTimeout(() => {
      this.loadData()
    }, 10)
    this.closeModal("#new-instance-dialog")
  }

  deleteFood() {
    this.foodService.deleteFood(this.currentFoodToDelete)
    setTimeout(() => {
      this.loadData()
    }, 10)
    this.closeModal("#delete-instance-dialog")
  }

  loadData() {
    this.foodService.getAllFoods().subscribe(res => {
      this.foods = JSON.parse(JSON.stringify(res))
    })
    this.allergyService.getAllAllergies().subscribe(res => {
      this.allergies = JSON.parse(JSON.stringify(res))
    })
    this.categoryService.getAllCategories().subscribe(res => {
      this.categories = JSON.parse(JSON.stringify(res))
    })
  }
}

interface Food {
  id: number;
  name: string;
  price: number;
  category: number;
  allergies: number[];
}

interface Category {
  id: number;
  name: string
}

interface Allergy {
  id: number;
  name: string
}
