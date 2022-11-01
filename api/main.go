package main

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"github.com/rs/cors"
	"log"
	"net/http"
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
