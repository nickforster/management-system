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

func getAllActiveOrders(userID int) ([]Order, error) {
	var orders []Order
	rows, err := db.Query("SELECT order_id, orders.table_id, complete FROM orders LEFT JOIN tables ON orders.table_id=tables.table_id WHERE user_id = ? AND complete=false", userID)
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

func getOrdersOfTable(tableID int) ([]Order, error) {
	var orders []Order
	rows, err := db.Query("SELECT order_id, table_id, complete FROM orders WHERE table_id=?", tableID)
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
func createOrderInDB(tableID int, complete bool) error {
	insert, err := db.Query("INSERT INTO orders (table_id, complete, last_update) VALUES (?, ?, NOW());", tableID, complete)
	err = insert.Close()
	if err != nil {
		return err
	}

	return err
}

func completeOrderInDB(id int) error {
	rows, err := db.Query("UPDATE orders set complete=true WHERE order_id=?;", id)
	err = rows.Close()
	if err != nil {
		return err
	}
	return err
}

func changeTableOfOrderInDB(id int, tableID int) error {
	rows, err := db.Query("UPDATE orders set table_id=? WHERE order_id=?;", tableID, id)
	err = rows.Close()
	if err != nil {
		return err
	}
	return err
}

func deleteOrderInDB(id int) error {
	rows, err := db.Query("DELETE FROM orders WHERE order_id=?", id)
	err = rows.Close()
	if err != nil {
		return err
	}

	return err
}

func addFoodToOrderInDB(id int, foodID int) error {
	insert, err := db.Query("INSERT INTO order_food (order_id, food_id) VALUES (?, ?);", id, foodID)
	err = insert.Close()
	if err != nil {
		return err
	}

	return err
}

func removeFoodFromOrderInDB(id int) error {
	rows, err := db.Query("DELETE FROM order_food WHERE order_food_id=?", id)
	err = rows.Close()
	if err != nil {
		return err
	}

	return err
}
