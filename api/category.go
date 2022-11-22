package main

type Category struct {
	Id     int    `json:"id"`
	Name   string `json:"name"`
	UserID int    `json: "userId"`
}

func getAllCategories(userID int) ([]Category, error) {
	var categories []Category
	rows, err := db.Query("SELECT category_id, name from categories where user_id = ?", userID)
	if err != nil {
		return categories, err
	}
	defer rows.Close()

	for rows.Next() {
		var category Category
		if err := rows.Scan(&category.Id, &category.Name); err != nil {
			return categories, err
		} else {
			categories = append(categories, category)
		}
	}

	return categories, err
}

func insertCategoryIntoDB(name string, userID int) error {
	insert, err := db.Query("INSERT INTO categories VALUES(null, ?, ?);", name, userID)
	err = insert.Close()
	if err != nil {
		return err
	}

	return err
}

func updateCategoryInDB(id int, name string) error {
	rows, err := db.Query("UPDATE categories set name=? WHERE category_id=?", name, id)
	err = rows.Close()
	if err != nil {
		return err
	}
	return err
}

func deleteCategoryInDB(id int) error {
	rows, err := db.Query("DELETE FROM categories WHERE category_id=?", id)
	err = rows.Close()
	if err != nil {
		return err
	}

	return err
}
