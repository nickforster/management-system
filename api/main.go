package main

import (
	"encoding/json"
	_ "github.com/go-sql-driver/mysql"
	"github.com/golang-jwt/jwt/v4"
	"github.com/rs/cors"
	"log"
	"net/http"
	"net/mail"
	"net/smtp"
	"strings"
)

// connection to database happens in external connection.go file
const port = "3000"

func main() {
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	mux := http.NewServeMux()
	mux.HandleFunc("/", start)
	mux.HandleFunc("/login", login)
	mux.HandleFunc("/register", register)
	mux.HandleFunc("/authorise", authorise)
	mux.HandleFunc("/getUser", getUser)
	mux.HandleFunc("/updateUser", updateUser)
	mux.HandleFunc("/getCategories", getCategories)
	mux.HandleFunc("/insertCategory", insertCategory)
	mux.HandleFunc("/updateCategory", updateCategory)
	mux.HandleFunc("/deleteCategory", deleteCategory)
	mux.HandleFunc("/getAllergies", getAllergies)
	mux.HandleFunc("/insertAllergy", insertAllergy)
	mux.HandleFunc("/updateAllergy", updateAllergy)
	mux.HandleFunc("/deleteAllergy", deleteAllergy)
	mux.HandleFunc("/getTables", getTables)
	mux.HandleFunc("/insertTable", insertTable)
	mux.HandleFunc("/updateTable", updateTable)
	mux.HandleFunc("/deleteTable", deleteTable)
	mux.HandleFunc("/getFoods", getFoods)
	mux.HandleFunc("/insertFood", insertFood)
	mux.HandleFunc("/updateFood", updateFood)
	mux.HandleFunc("/deleteFood", deleteFood)
	mux.HandleFunc("/sendMail", sendMail)
	mux.HandleFunc("/getOrders", getOrders)
	mux.HandleFunc("/getActiveOrders", getActiveOrders)
	mux.HandleFunc("/getTableOrders", getTableOrders)
	mux.HandleFunc("/createOrder", createOrder)
	mux.HandleFunc("/completeOrder", completeOrder)
	mux.HandleFunc("/changeTableOfOrder", changeTableOfOrder)
	mux.HandleFunc("/deleteOrder", deleteOrder)
	mux.HandleFunc("/addFoodToOrder", addFoodToOrder)
	mux.HandleFunc("/removeFoodFromOrder", removeFoodFromOrder)

	handler := cors.AllowAll().Handler(mux)

	log.Println("Listening for connections on port: ", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

func start(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("welcome"))
}

func login(w http.ResponseWriter, r *http.Request) {
	data := readUserBody(w, r, "Login failed!")

	if !authoriseUser(data.Username, data.Password, w) {
		http.Error(w, "Username or password is wrong", http.StatusUnauthorized)
	}
}

func register(w http.ResponseWriter, r *http.Request) {
	data := readUserBody(w, r, "Registration failed!")

	user, _ := getUserByEmail(data.Email)
	if user.Username != "" { // user from database where email = input --> should not exist
		http.Error(w, "Registration failed, user with this E-Mail already exists", http.StatusConflict)
		return
	}

	_, err = mail.ParseAddress(data.Email)
	if err != nil { // error if email is not valid
		http.Error(w, "Registration failed, invalid E-Mail", http.StatusBadRequest)
		return
	}

	user, _ = getUserByUsername(data.Username)
	if user.Email != "" { // user from database with username = input --> should not exist
		http.Error(w, "Registration failed, user with this Username already exists", http.StatusConflict)
		return
	}

	err = insertUser(data.Username, data.Password, data.Email)
	if err != nil {
		http.Error(w, "Registration failed!", http.StatusInternalServerError)
		return
	}
	generateToken(user.Id, user.Username, w)
	w.WriteHeader(200)
}

func authorise(w http.ResponseWriter, r *http.Request) {
	reqToken := r.Header.Get("Authorization")
	authFields := strings.Fields(reqToken)
	token, err := jwt.Parse(authFields[1], func(t *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err == nil && token.Valid {
		w.WriteHeader(200)
	} else {
		http.Error(w, "Not logged in!", http.StatusUnauthorized)
	}
}

func getUser(w http.ResponseWriter, r *http.Request) {
	if !isAuthorised(r) {
		http.Error(w, "Not logged in!", http.StatusUnauthorized)
		return
	}

	user := readUserBody(w, r, "Could not identify sent Parameters")
	user, err = getUserById(user.Id)

	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	} else {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(user)
	}
}

func updateUser(w http.ResponseWriter, r *http.Request) {
	if !isAuthorised(r) {
		http.Error(w, "Not logged in!", http.StatusUnauthorized)
		return
	}

	var errorMessage = "User could not be updated"
	data := readUserBody(w, r, errorMessage)

	user, _ := getUserByEmail(data.Email)
	if user.Username != "" { // user from database where email = input --> should not exist
		http.Error(w, "Update failed, user with this E-Mail already exists", http.StatusConflict)
		return
	}

	_, err = mail.ParseAddress(data.Email)
	if err != nil { // error if email is not valid
		http.Error(w, "Update failed, invalid E-Mail", http.StatusBadRequest)
		return
	}

	user, _ = getUserByUsername(data.Username)
	if user.Email != "" { // user from database with username = input --> should not exist
		http.Error(w, "Update failed, user with this Username already exists", http.StatusConflict)
		return
	}

	err := updateUserInDB(data.Id, data.Username, data.Email, data.Password)
	if err != nil {
		http.Error(w, errorMessage, http.StatusInternalServerError)
	} else {
		w.WriteHeader(200)
	}

}

func getCategories(w http.ResponseWriter, r *http.Request) {
	if !isAuthorised(r) {
		http.Error(w, "Not logged in!", http.StatusUnauthorized)
		return
	}

	var categories []Category
	data := readCategoryBody(w, r, "Could not identify sent Parameters")

	categories, err = getAllCategories(data.UserID)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	} else {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(categories)
	}
}

func insertCategory(w http.ResponseWriter, r *http.Request) {
	if !isAuthorised(r) {
		http.Error(w, "Not logged in!", http.StatusUnauthorized)
		return
	}

	var errorMessage = "Category could not be added"
	data := readCategoryBody(w, r, errorMessage)
	err := insertCategoryIntoDB(data.Name, data.UserID)
	if err != nil {
		http.Error(w, errorMessage, http.StatusInternalServerError)
	} else {
		w.WriteHeader(200)
	}
}

func updateCategory(w http.ResponseWriter, r *http.Request) {
	if !isAuthorised(r) {
		http.Error(w, "Not logged in!", http.StatusUnauthorized)
		return
	}

	var errorMessage = "Category could not be updated"
	data := readCategoryBody(w, r, errorMessage)
	err := updateCategoryInDB(data.Id, data.Name)
	if err != nil {
		http.Error(w, errorMessage, http.StatusInternalServerError)
	} else {
		w.WriteHeader(200)
	}
}

func deleteCategory(w http.ResponseWriter, r *http.Request) {
	if !isAuthorised(r) {
		http.Error(w, "Not logged in!", http.StatusUnauthorized)
		return
	}

	var errorMessage = "Category could not be deleted"
	data := readCategoryBody(w, r, errorMessage)
	err := deleteCategoryInDB(data.Id)
	if err != nil {
		http.Error(w, errorMessage, http.StatusInternalServerError)
	} else {
		w.WriteHeader(200)
	}
}

func getAllergies(w http.ResponseWriter, r *http.Request) {
	if !isAuthorised(r) {
		http.Error(w, "Not logged in!", http.StatusUnauthorized)
		return
	}

	var allergies []Allergy
	data := readAllergyBody(w, r, "Could not identify sent Parameters")

	allergies, err = getAllAllergies(data.UserID)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	} else {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(allergies)
	}
}

func insertAllergy(w http.ResponseWriter, r *http.Request) {
	if !isAuthorised(r) {
		http.Error(w, "Not logged in!", http.StatusUnauthorized)
		return
	}

	var errorMessage = "Allergy could not be added"
	data := readAllergyBody(w, r, errorMessage)
	err := insertAllergyIntoDB(data.Name, data.UserID)
	if err != nil {
		http.Error(w, errorMessage, http.StatusInternalServerError)
	} else {
		w.WriteHeader(200)
	}
}

func updateAllergy(w http.ResponseWriter, r *http.Request) {
	if !isAuthorised(r) {
		http.Error(w, "Not logged in!", http.StatusUnauthorized)
		return
	}

	var errorMessage = "Allergy could not be updated"
	data := readAllergyBody(w, r, errorMessage)
	err := updateAllergyInDB(data.Id, data.Name)
	if err != nil {
		http.Error(w, errorMessage, http.StatusInternalServerError)
	} else {
		w.WriteHeader(200)
	}
}

func deleteAllergy(w http.ResponseWriter, r *http.Request) {
	if !isAuthorised(r) {
		http.Error(w, "Not logged in!", http.StatusUnauthorized)
		return
	}

	var errorMessage = "Allergy could not be deleted"
	data := readAllergyBody(w, r, errorMessage)
	err := deleteAllergyInDB(data.Id)
	if err != nil {
		http.Error(w, errorMessage, http.StatusInternalServerError)
	} else {
		w.WriteHeader(200)
	}
}

func getTables(w http.ResponseWriter, r *http.Request) {
	if !isAuthorised(r) {
		http.Error(w, "Not logged in!", http.StatusUnauthorized)
		return
	}

	var tables []Table
	data := readTableBody(w, r, "Could not identify sent Parameters")

	tables, err = getAllTables(data.UserID)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	} else {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(tables)
	}
}

func insertTable(w http.ResponseWriter, r *http.Request) {
	if !isAuthorised(r) {
		http.Error(w, "Not logged in!", http.StatusUnauthorized)
		return
	}

	var errorMessage = "Table could not be added"
	data := readTableBody(w, r, errorMessage)
	err := insertTableIntoDB(data.Name, data.AmountPeople, data.UserID)
	if err != nil {
		http.Error(w, errorMessage, http.StatusInternalServerError)
	} else {
		w.WriteHeader(200)
	}
}

func updateTable(w http.ResponseWriter, r *http.Request) {
	if !isAuthorised(r) {
		http.Error(w, "Not logged in!", http.StatusUnauthorized)
		return
	}

	var errorMessage = "Table could not be updated"
	data := readTableBody(w, r, errorMessage)
	err := updateTableInDB(data.Id, data.Name, data.AmountPeople)
	if err != nil {
		http.Error(w, errorMessage, http.StatusInternalServerError)
	} else {
		w.WriteHeader(200)
	}
}

func deleteTable(w http.ResponseWriter, r *http.Request) {
	if !isAuthorised(r) {
		http.Error(w, "Not logged in!", http.StatusUnauthorized)
		return
	}

	var errorMessage = "Table could not be deleted"
	data := readTableBody(w, r, errorMessage)
	err := deleteTableInDB(data.Id)
	if err != nil {
		http.Error(w, errorMessage, http.StatusInternalServerError)
	} else {
		w.WriteHeader(200)
	}
}

func getFoods(w http.ResponseWriter, r *http.Request) {
	if !isAuthorised(r) {
		http.Error(w, "Not logged in!", http.StatusUnauthorized)
		return
	}

	var foods []Food
	data := readFoodBody(w, r, "Could not identify sent Parameters")

	foods, err = getAllFoods(data.UserID)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	} else {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(foods)
	}
}

func insertFood(w http.ResponseWriter, r *http.Request) {
	if !isAuthorised(r) {
		http.Error(w, "Not logged in!", http.StatusUnauthorized)
		return
	}

	var errorMessage = "Food could not be added"
	data := readFoodBody(w, r, errorMessage)
	err := insertFoodIntoDB(data.Name, data.Price, data.CategoryID, data.Allergies, data.UserID)
	if err != nil {
		http.Error(w, errorMessage, http.StatusInternalServerError)
	} else {
		w.WriteHeader(200)
	}
}

func updateFood(w http.ResponseWriter, r *http.Request) {
	if !isAuthorised(r) {
		http.Error(w, "Not logged in!", http.StatusUnauthorized)
		return
	}

	var errorMessage = "Food could not be updated"
	data := readFoodBody(w, r, errorMessage)
	err := updateFoodInDB(data.Id, data.Name, data.Price, data.CategoryID, data.Allergies)
	if err != nil {
		http.Error(w, errorMessage, http.StatusInternalServerError)
	} else {
		w.WriteHeader(200)
	}
}

func deleteFood(w http.ResponseWriter, r *http.Request) {
	if !isAuthorised(r) {
		http.Error(w, "Not logged in!", http.StatusUnauthorized)
		return
	}

	var errorMessage = "Food could not be deleted"
	data := readFoodBody(w, r, errorMessage)
	err := deleteFoodInDB(data.Id)
	if err != nil {
		http.Error(w, errorMessage, http.StatusInternalServerError)
	} else {
		w.WriteHeader(200)
	}
}

func sendMail(w http.ResponseWriter, r *http.Request) {
	var errorMessage = "Mail could not be sent"
	data := readMailBody(w, r, errorMessage)

	to := []string{data.To}
	message := []byte(data.Message)

	password := "password"
	smtpHost := "smtp.gmail.com"
	smtpPort := "587" // or 465

	auth := smtp.PlainAuth("", data.From, password, smtpHost)
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, data.From, to, message)

	if err != nil {
		http.Error(w, errorMessage, http.StatusInternalServerError)
	} else {
		w.WriteHeader(200)
	}
}

func getOrders(w http.ResponseWriter, r *http.Request) {

}

func getActiveOrders(w http.ResponseWriter, r *http.Request) {

}

func getTableOrders(w http.ResponseWriter, r *http.Request) {

}

func createOrder(w http.ResponseWriter, r *http.Request) {

}

func completeOrder(w http.ResponseWriter, r *http.Request) {

}

func changeTableOfOrder(w http.ResponseWriter, r *http.Request) {

}

func deleteOrder(w http.ResponseWriter, r *http.Request) {

}

func addFoodToOrder(w http.ResponseWriter, r *http.Request) {

}

func removeFoodFromOrder(w http.ResponseWriter, r *http.Request) {

}
