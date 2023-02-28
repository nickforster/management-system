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
	rows, err := db.Query("SELECT order_id, table_id, complete FROM orders LEFT JOIN tables ON orders.table_id=tables.table_id WHERE user_id = ? AND complete=false", userID)
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
