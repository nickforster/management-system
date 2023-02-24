package main

type Order struct {
	Id       int  `json:"id"`
	TableID  int  `json:"tableId"`
	Complete bool `json:"complete"`
}

func getAllOrders(userID int) {

}

func getAllActiveOrders(userID int) {

}

func createOrderInDB(tableID int, complete bool, userID int) {

}

func completeOrderInDB(id int) {

}

func changeTableOfOrderInDB(id int, tableID int) {

}

func deleteOrderInDB(id int) {

}

func addFoodToOrderInDB(id int, foodID int) {

}

func removeFoodFromOrderInDB(id int, foodID int) {

}
