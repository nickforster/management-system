package main

type Allergy struct {
	Id     int    `json:"id"`
	Name   string `json:"name"`
	UserID int    `json:"userId"`
}

func getAllAllergies(userID int) ([]Allergy, error) {
	var allergies []Allergy
	rows, err := db.Query("SELECT allergy_id, name from allergies where user_id = ?", userID)
	if err != nil {
		return allergies, err
	}
	defer rows.Close()

	for rows.Next() {
		var allergy Allergy
		if err := rows.Scan(&allergy.Id, &allergy.Name); err != nil {
			return allergies, err
		} else {
			allergies = append(allergies, allergy)
		}
	}

	return allergies, err
}

func insertAllergyIntoDB(name string, userID int) error {
	insert, err := db.Query("INSERT INTO allergies VALUES(null, ?, ?);", name, userID)
	err = insert.Close()
	if err != nil {
		return err
	}

	return err
}

func updateAllergyInDB(id int, name string) error {
	rows, err := db.Query("UPDATE allergies set name=? WHERE allergy_id=?", name, id)
	err = rows.Close()
	if err != nil {
		return err
	}
	return err
}

func deleteAllergyInDB(id int) error {
	rows, err := db.Query("DELETE FROM allergies WHERE allergy_id=?", id)
	err = rows.Close()
	if err != nil {
		return err
	}

	return err
}
