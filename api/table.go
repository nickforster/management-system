package main

type Table struct {
	Id           int    `json:"id"`
	Name         string `json:"name"`
	AmountPeople int    `json:"amountPeople"`
	UserID       int    `json: "userId"`
}

func getAllTables(userID int) ([]Table, error) {
	var tables []Table
	rows, err := db.Query("SELECT table_id, name, amount_people from tables where user_id = ?", userID)
	if err != nil {
		return tables, err
	}
	defer rows.Close()

	for rows.Next() {
		var table Table
		if err := rows.Scan(&table.Id, &table.Name, &table.AmountPeople); err != nil {
			return tables, err
		} else {
			tables = append(tables, table)
		}
	}

	return tables, err
}

func insertTableIntoDB(name string, amountPeople int, userID int) error {
	insert, err := db.Query("INSERT INTO tables VALUES(null, ?, ?, ?);", name, amountPeople, userID)
	err = insert.Close()
	if err != nil {
		return err
	}

	return err
}

func updateTableInDB(id int, name string, amountPeople int) error {
	rows, err := db.Query("UPDATE tables set name=?, amount_people=? WHERE table_id=?", name, amountPeople, id)
	err = rows.Close()
	if err != nil {
		return err
	}
	return err
}

func deleteTableInDB(id int) error {
	rows, err := db.Query("DELETE FROM tables WHERE table_id=?", id)
	err = rows.Close()
	if err != nil {
		return err
	}

	return err
}
