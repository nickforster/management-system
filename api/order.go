package main

type Order struct {
	Id       int  `json:"id"`
	TableID  int  `json:"tableId"`
	Complete bool `json:"complete"`
}

func getAllOrders(userID int) ([]Order, error) {
	var orders []Order
	rows, err := db.Query("SELECT order_id, table_id, complete FROM orders LEFT JOIN tables ON orders.table_id=tables.table_id WHERE user_id = ?", userID)
	if err != nil {
		return orders, err
	}
	defer rows.Close()

	for rows.Next() {
		var order Order
		if err := rows.Scan(&order.Id, &order.TableID, &order.Complete); err != nil {
			return orders, err
		} else {
			orders = append(orders, order)
		}
	}

	return orders, err
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
