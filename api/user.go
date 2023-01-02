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

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func getUserByUsername(username string) (User, error) {
	var users []User
	var u User
	rows, err := db.Query("SELECT * FROM users WHERE username = ?;", username)
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

func insertUser(username string, password string, email string) error {
	password, err = hashPassword(password)
	if err != nil {
		return err
	}
	insert, err := db.Query("INSERT INTO users VALUES(null, ?, ?, ?);", username, password, email)
	insert.Close()

	return err
}

func getUserByEmail(email string) (User, error) {
	var users []User
	var u User
	rows, err := db.Query("SELECT * FROM users WHERE email = ?;", email)
	defer rows.Close()

	if err != nil {
		return users[0], err
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

func getUserById(id int) (User, error) {
	var users []User
	var u User
	rows, err := db.Query("SELECT * FROM users WHERE user_id = ?;", id)
	defer rows.Close()

	if err != nil {
		return users[0], err
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
		users[0].Password = ""
		return users[0], err
	}
}

func updateUserInDB(id int, username string, email string, password string) error {
	if password == "" {
		rows, err := db.Query("UPDATE users set username=?, email=? WHERE user_id=?", username, email, id)
		err = rows.Close()
		if err != nil {
			return err
		}
		return err
	} else {
		password, err = hashPassword(password)
		if err != nil {
			return err
		}
		rows, err := db.Query("UPDATE users set username=?, email=?, password=? WHERE user_id=?", username, email, password, id)
		err = rows.Close()
		if err != nil {
			return err
		}
		return err
	}
}
