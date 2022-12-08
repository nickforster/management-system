package main

import "fmt"

type Food struct {
	Id         int     `json:"id"`
	Name       string  `json:"name"`
	Price      float32 `json:"price"`
	CategoryID int     `json:"categoryID"`
	Allergies  []int   `json:"allergies"`
	UserID     int     `json:"userId"`
}

func getAllFoods(userID int) ([]Food, error) {
	var foods []Food
	rows, err := db.Query("SELECT food_id, name, price, category_id from foods where user_id = ?", userID)
	if err != nil {
		return foods, err
	}
	defer rows.Close()

	for rows.Next() {
		var food Food
		if err := rows.Scan(&food.Id, &food.Name, &food.Price, &food.CategoryID); err != nil {
			fmt.Println(err)
			return foods, err
		} else {
			foods = append(foods, food)
		}
	}

	// get allergies to all the foods
	var allergies []int
	for i := 0; i < len(foods); i++ {
		rows, err = db.Query("SELECT allergy_id from allergy_food where food_id = ?", foods[i].Id)
		if err != nil {
			fmt.Println(err)
			return foods, err
		}

		for rows.Next() {
			var allergyID int
			if err := rows.Scan(&allergyID); err != nil {
				fmt.Println(err)
				return foods, err
			} else {
				allergies = append(allergies, allergyID)
			}
		}
		foods[i].Allergies = allergies
		allergies = nil
	}
	defer rows.Close()

	return foods, err
}

func insertFoodIntoDB(name string, price float32, categoryID int, allergies []int, userID int) error {
	insert, err := db.Query("INSERT INTO foods VALUES(null, ?, ?, ?, ?);", name, price, userID, categoryID)
	err = insert.Close()
	if err != nil {
		return err
	}

	for i := 0; i < len(allergies); i++ {
		rows, err := db.Query("INSERT INTO allergy_food VALUES(LAST_INSERT_ID(), ?);", allergies[i])
		err = rows.Close()
		if err != nil {
			return err
		}
	}

	return err
}

func updateFoodInDB(id int, name string, price float32, categoryID int, allergies []int) error {
	rows, err := db.Query("UPDATE foods set name=?, price=?, category_id=? WHERE food_id=?", name, price, categoryID, id)
	err = rows.Close()
	if err != nil {
		return err
	}

	// delete all allergies to that food
	rows, err = db.Query("DELETE FROM allergy_food WHERE food_id=?", id)
	err = rows.Close()
	if err != nil {
		return err
	}

	// add each allergy again
	for i := 0; i < len(allergies); i++ {
		rows, err = db.Query("INSERT INTO allergy_food VALUES(?, ?);", id, allergies[i])
		err = rows.Close()
		if err != nil {
			return err
		}
	}

	return err
}

func deleteFoodInDB(id int) error {
	rows, err := db.Query("DELETE FROM allergy_food WHERE food_id=?", id)
	err = rows.Close()
	if err != nil {
		return err
	}

	rows, err = db.Query("DELETE FROM foods WHERE food_id=?", id)
	err = rows.Close()
	if err != nil {
		return err
	}

	return err
}
