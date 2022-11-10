import {Component, OnInit} from '@angular/core';
import {faBars, faPenToSquare, faPlus, faSignature, faTag, faXmark} from '@fortawesome/free-solid-svg-icons';
import {AuthenticationService} from "../../authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-foods',
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.css'],
})
export class FoodsComponent implements OnInit {
  // Fontawesome Icons
  faPlus = faPlus
  faPenToSquare = faPenToSquare
  faXMark = faXmark

  selectedFood: number | undefined // displays the other infos of the food
  sortBy: string = 'Sort by category'

  title: string = 'New Food'
  id: number | undefined
  name: string = '' // name of the food - ngmodel
  price: number | string = '' // price of the food - ngmodel
  selectedCategory: string = '' // name of the selected category - ngmodel
  selectedAllergies: boolean[] = []

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

  constructor() { }

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
    }
  }


  loadData() {
    // TODO make request to load foods (this.allFoods), categories (this.categories) allergies (this.allergies) from DB
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
