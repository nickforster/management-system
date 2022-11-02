package main

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"github.com/rs/cors"
	"log"
	"net/http"
	"net/mail"
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

	handler := cors.AllowAll().Handler(mux)

	log.Println("Listening for connections on port: ", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

func start(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("welcome"))
}

func login(w http.ResponseWriter, r *http.Request) {
	data := readBody(w, r, "Login failed!")

	if !authoriseUser(data.Username, data.Password, w) {
		http.Error(w, "Login failed!", http.StatusUnauthorized)
	}
}

func register(w http.ResponseWriter, r *http.Request) {
	data := readBody(w, r, "Registration failed!")

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
