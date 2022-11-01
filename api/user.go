package main

import (
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

type User struct {
	Id       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

type Claims struct {
	Id       int    `json:"id"`
	Username string `json:"username"`
	jwt.StandardClaims
}

func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func getUserByUsername(username string) (User, error) {
	var users []User
	var u User
	rows, err := db.Query("SELECT * FROM user WHERE username = ?;", username)
	defer rows.Close()

	if err != nil {
		return u, err
	}

	for rows.Next() {
		var user User
		if err := rows.Scan(&user.Id, &user.Username, &user.Password, &user.Email); err != nil {
			return u, err
		} else {
			users = append(users, user)
		}
	}
	if users == nil {
		return u, err
	} else {
		return users[0], err
	}
}

func authoriseUser(username string, password string, w http.ResponseWriter) bool {
	user, err := getUserByUsername(username)
	if err != nil {
		return false
	} else {
		return checkPasswordHash(password, user.Password) && generateToken(user.Id, user.Username, w)
	}
}
