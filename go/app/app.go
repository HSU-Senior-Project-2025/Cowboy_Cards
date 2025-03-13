package app

import (
	"context"
	"log"
	"net/http"
	"os"
	"path"
	"time"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/controllers"
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/routes"
	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt/v5"
	"github.com/golang-jwt/jwt/v5/request"
	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/joho/godotenv/autoload"
	"github.com/urfave/negroni/v3"
)

func LoadPoolConfig() (config *pgxpool.Config) {
	var (
		dburl  = os.Getenv("DATABASE_URL")
		dbuser = os.Getenv("DBUSER")
		dbhost = os.Getenv("DBHOST")
	)

	if dburl == "" || dbuser == "" || dbhost == "" {
		log.Fatalf("db env vars not loaded")
	}

	config, err := pgxpool.ParseConfig(dburl)
	if err != nil {
		log.Fatalf("error parsing config: %v", err)
	}

	config.ConnConfig.User = dbuser
	config.ConnConfig.Host = dbhost

	return
}

func CreatePool(config *pgxpool.Config) (h *controllers.Handler) {
	ctx := context.Background()

	pgpool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		log.Fatalf("error creating connection pool: %v", err)
	}

	if err := pgpool.Ping(ctx); err != nil {
		log.Fatalf("error connecting to database: %v", err)
	}

	log.Println("Successfully connected to database")

	h = &controllers.Handler{DB: pgpool}

	// Enable SSL for Supabase
	// conn.TLSConfig = &tls.Config{
	// 	MinVersion: tls.VersionTLS12,
	// }

	return
}

func setCacheControlHeader(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	str := ""

	if path.Clean(r.URL.Path) == "/" {
		str = "no-cache, no-store, must-revalidate"
	} else {
		str = "public, max-age=31536000, immutable"
	}

	w.Header().Set("Cache-Control", str)
	next(w, r)
}

var (
	jwtKey  = []byte(os.Getenv("JWT_SECRET"))
	keyFunc = func(token *jwt.Token) (interface{}, error) { return jwtKey, nil }
)

// Define a custom key type to prevent collisions
// type contextKey string

// const userIdKey contextKey = "userId"

// func authMiddleware(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
//     // Set value in context
//     ctx := context.WithValue(r.Context(), userIdKey, "12345")
//     r = r.WithContext(ctx)

//     // Call next handler
//     next(w, r)
// }

// func handler(w http.ResponseWriter, r *http.Request) {
//     // Retrieve value directly from request
//     userId := context.Get(r, "userId").(string)
//     w.Write([]byte("Hello, User " + userId))
// }

// func main() {
//     n := negroni.Classic()
//     n.Use(negroni.HandlerFunc(authMiddleware))
//     n.UseHandler(http.HandlerFunc(handler))

//     http.ListenAndServe(":3000", n)
// }

// authMiddleware handles authentication for incoming requests
func authMiddleware(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {

	token, err := request.ParseFromRequest(r, request.AuthorizationHeaderExtractor, keyFunc)

	// claims := &Claims{}
	// token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
	// 	return jwtKey, nil
	// })

	if err != nil || !token.Valid {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	ctx := context.WithValue(r.Context(), "user_id", claims.UserID)
	next.ServeHTTP(w, r.WithContext(ctx))

}

func Init() {
	cfg := LoadPoolConfig()
	h := CreatePool(cfg)

	n := negroni.New()
	n.Use(negroni.NewLogger())
	n.Use(negroni.NewRecovery())
	n.Use(negroni.HandlerFunc(setCacheControlHeader))
	n.Use(negroni.NewStatic(http.Dir("./dist")))

	r := chi.NewRouter()
	routes.Routes(r, h)

	n.UseHandler(r)

	port, ok := os.LookupEnv("PORT")
	if !ok {
		port = "8000"
	}
	log.Println("server running on port " + port)

	srv := &http.Server{
		Handler: n,
		// Addr:         "127.0.0.1:" + port,
		Addr:         ":" + port,
		WriteTimeout: 10 * time.Second,
		ReadTimeout:  10 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
