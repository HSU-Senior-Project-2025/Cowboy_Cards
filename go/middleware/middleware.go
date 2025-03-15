package middleware

import (
	"context"
	"log"
	"net/http"
	"os"
	"path"

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
	jwtAud  = []byte(os.Getenv("JWT_AUD"))
	jwtIss  = []byte(os.Getenv("JWT_ISS"))
	jwtKey  = []byte(os.Getenv("JWT_SECRET"))
	keyFunc = func(token *jwt.Token) (any, error) { return jwtKey, nil }
)

func Auth(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {

	registeredClaims := &jwt.RegisteredClaims{}

	token, err := request.ParseFromRequest(r, request.AuthorizationHeaderExtractor, keyFunc, request.WithClaims(registeredClaims))

	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
		log.Printf("Unexpected signing method: %v", token.Header["alg"])
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	for _, v := range jwt.GetAlgorithms() {
		log.Printf("alg: %v\n", v)
	}

	auds, err := registeredClaims.GetAudience()
	for _, v := range auds {
		log.Printf("aud: %v\n", v)
	}

	expTime, err := registeredClaims.GetExpirationTime()
	log.Printf("expTime: %v\n", expTime.String())

	issAt, err := registeredClaims.GetIssuedAt()
	log.Printf("issAt: %v\n", issAt.String())

	issuer, err := registeredClaims.GetIssuer()
	log.Printf("issuer: %v\n", issuer)

	notBefore, err := registeredClaims.GetNotBefore()
	log.Printf("notBefore: %v\n", notBefore.String())

	sub, err := registeredClaims.GetSubject()
	log.Printf("sub: %v\n", sub)

	if err != nil || !token.Valid {
		log.Printf("problem with token claims... %v", err)
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	log.Printf("id claim: %v\n", registeredClaims.ID)

	ctx := context.WithValue(r.Context(), userIdKey, registeredClaims.Subject)
	next(w, r.WithContext(ctx))
}
