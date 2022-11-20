package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/golang-jwt/jwt/v4"
	"github.com/rs/cors"
	"log"
	"net/http"
	"net/mail"
	"strings"
)

var db, err = sql.Open("mysql", "username:password@tcp(127.0.0.1:3306)/management_System")

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
	mux.HandleFunc("/getCategories", getCategories)

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
		http.Error(w, "Login failed!", http.StatusUnauthorized)
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
		fmt.Println("valid token")
		w.WriteHeader(200)
	} else {
		fmt.Println("invalid token")
		http.Error(w, "Not logged in!", http.StatusUnauthorized)
	}
}

func getCategories(w http.ResponseWriter, r *http.Request) {
	var categories []Category

	categories, err = getAllCategories()
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	} else {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(categories)
	}
}
