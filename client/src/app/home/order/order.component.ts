import {Component, Input, OnInit} from '@angular/core';
import {FoodService} from "../../services/food.service";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  @Input() title: string = "Add Food"
  errorMessage: string = ""
  selectedFood: string[] = []
  selectedAmount: number[] = []
  foods: Food[] = []
  foodsToAdd: number[] = []

  constructor(
    private foodService: FoodService,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.authenticationService.authorise()
    this.loadData()
  }

  loadData() {
    this.foodService.getAllFoods().subscribe(res => {
      this.foods = JSON.parse(JSON.stringify(res))
      this.foodsToAdd[0] = this.foods[0].id
      this.selectedAmount[0] = 1
    })
  }

  save() {

  }

  abort() {

  }

  subtract(index: number) {
    this.selectedAmount[index] = Math.max(this.selectedAmount[index] - 1, 1)
  }

}

interface Food {
  id: number;
  name: string;
  price: number;
  categoryID: number;
  allergies: number[];
}
