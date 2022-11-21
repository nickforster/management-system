package main

import (
	"encoding/json"
	"github.com/golang-jwt/jwt/v4"
	"io/ioutil"
	"net/http"
	"time"
)

var jwtKey = []byte("TdbDXoW^5TQeNVm2fq5Qf6jbG*z^GsrZ^Fp5bcBE!tXJ7rvi37Gm5nrxz6WWiVFqseA^2x!PLs7uP*d!H8ZiPsYgs$Wju%M&R@62hzCUGTsbNoVX3Uuc3fRrV468@$o9")

func readUserBody(w http.ResponseWriter, r *http.Request, errorMessage string) User {
	body, err := ioutil.ReadAll(r.Body)
	data := User{} // struct from user.go file
	if err != nil {
		http.Error(w, errorMessage, http.StatusUnauthorized)
		panic(err.Error())
	}

	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, errorMessage, http.StatusInternalServerError)
		panic(err.Error())
	}

	return data
}

func readCategoryBody(w http.ResponseWriter, r *http.Request, errorMessage string) Category {
	body, err := ioutil.ReadAll(r.Body)
	data := Category{} // struct from category.go file
	if err != nil {
		http.Error(w, errorMessage, http.StatusUnauthorized)
		panic(err.Error())
	}

	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, errorMessage, http.StatusInternalServerError)
		panic(err.Error())
	}

	return data
}

func generateToken(id int, username string, w http.ResponseWriter) bool {
	expirationTime := time.Now().Add(15 * time.Minute)
	claims := &Claims{
		Id:       id,
		Username: username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		http.Error(w, "Login failed!", http.StatusInternalServerError)
		return false
	} else {
		json, err := json.Marshal(struct {
			Token string `json:"token"`
		}{
			tokenString,
		})

		if err != nil {
			http.Error(w, "Login failed!", http.StatusUnauthorized)
			panic(err.Error())
		}

		w.Write(json)
		return true
	}
}
