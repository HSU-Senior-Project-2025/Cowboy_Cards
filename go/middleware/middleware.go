package middleware

import (
	"context"
	"log"
	"net/http"
	"os"
	"path"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/controllers"
	"github.com/golang-jwt/jwt/v5"
	"github.com/golang-jwt/jwt/v5/request"
)

func SetCacheControlHeader(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	str := ""

	if path.Clean(r.URL.Path) == "/" {
		str = "no-cache, no-store, must-revalidate"
	} else {
		str = "public, max-age=31536000, immutable"
	}

	w.Header().Set("Cache-Control", str)
	next(w, r)
}

type contextKey string

const userIdKey contextKey = "userId"

var (
	jwtKey  = []byte(os.Getenv("JWT_SECRET"))
	keyFunc = func(token *jwt.Token) (interface{}, error) { return jwtKey, nil }
)

func Auth(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {

	claims := &controllers.Claims{}

	token, err := request.ParseFromRequest(r, request.AuthorizationHeaderExtractor, keyFunc, request.WithClaims(claims))

	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
		log.Printf("Unexpected signing method: %v", token.Header["alg"])
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	for _, v := range jwt.GetAlgorithms() {
		log.Printf("alg: %v\n", v)
	}

	auds, err := claims.GetAudience()
	for _, v := range auds {
		log.Printf("aud: %v\n", v)
	}

	expTime, err := claims.GetExpirationTime()
	log.Printf("expTime: %v\n", expTime.String())

	issAt, err := claims.GetIssuedAt()
	log.Printf("issAt: %v\n", issAt.String())

	issuer, err := claims.GetIssuer()
	log.Printf("issuer: %v\n", issuer)

	notBefore, err := claims.GetNotBefore()
	log.Printf("notBefore: %v\n", notBefore.String())

	sub, err := claims.GetSubject()
	log.Printf("sub: %v\n", sub)

	if err != nil {
		log.Printf("problem with token claims... %v", err)
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	if err != nil || !token.Valid {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	log.Printf("custom claims: %v, %v, %v\n", claims.Email, claims.ID, claims.UserID)

	ctx := context.WithValue(r.Context(), userIdKey, claims.UserID)
	next(w, r.WithContext(ctx))
}
