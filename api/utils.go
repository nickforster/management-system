package main

import (
	"encoding/json"
	"github.com/golang-jwt/jwt/v4"
	"io/ioutil"
	"net/http"
	"strings"
	"time"
)

type Mail struct {
	Name    string `json:"name"`
	From    string `json:"from"`
	To      string `json:"to"`
	Subject string `json:"subject"`
	Message string `json:"message"`
}

type UserID struct {
	UserID int `json:"userId"`
}

type OrderFood struct {
	Id      int `json:"id"`
	OrderID int `json:"orderId"`
	FoodID  int `json:"foodId"`
}

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

func readAllergyBody(w http.ResponseWriter, r *http.Request, errorMessage string) Allergy {
	body, err := ioutil.ReadAll(r.Body)
	data := Allergy{} // struct from allergy.go file
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

func readTableBody(w http.ResponseWriter, r *http.Request, errorMessage string) Table {
	body, err := ioutil.ReadAll(r.Body)
	data := Table{} // struct from table.go file
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

func readOrderBody(w http.ResponseWriter, r *http.Request, errorMessage string) Order {
	body, err := ioutil.ReadAll(r.Body)
	data := Order{} // struct from order.go file
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

func readOrderFoodBody(w http.ResponseWriter, r *http.Request, errorMessage string) OrderFood {
	body, err := ioutil.ReadAll(r.Body)
	data := OrderFood{}
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

func readMailBody(w http.ResponseWriter, r *http.Request, errorMessage string) Mail {
	body, err := ioutil.ReadAll(r.Body)
	data := Mail{} // struct from utils.go file
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

func readBody(w http.ResponseWriter, r *http.Request, errorMessage string) UserID {
	body, err := ioutil.ReadAll(r.Body)
	data := UserID{} // struct from utils.go file
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

func readFoodBody(w http.ResponseWriter, r *http.Request, errorMessage string) Food {
	body, err := ioutil.ReadAll(r.Body)
	data := Food{} // struct from food.go file
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

func isAuthorised(r *http.Request) bool {
	reqToken := r.Header.Get("Authorization")
	authFields := strings.Fields(reqToken)
	if len(authFields) == 0 {
		return false
	}
	token, err := jwt.Parse(authFields[1], func(t *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	return err == nil && token.Valid
}
