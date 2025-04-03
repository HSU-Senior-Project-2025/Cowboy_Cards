package app

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/controllers"
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/middleware"
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/routes"
	"github.com/go-chi/chi/v5"
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

func CreatePool(config *pgxpool.Config) (h *controllers.Embed) {
	ctx := context.Background()

	pgpool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		log.Fatalf("error creating connection pool: %v", err)
	}

	if err := pgpool.Ping(ctx); err != nil {
		log.Fatalf("error connecting to database: %v", err)
	}

	log.Println("Successfully connected to database")

	h = &controllers.Embed{
		Handler: middleware.Handler{DB: pgpool},
	}

	// Enable SSL for Supabase
	// conn.TLSConfig = &tls.Config{
	// 	MinVersion: tls.VersionTLS12,
	// }

	return
}

func Init() {
	cfg := LoadPoolConfig()
	h := CreatePool(cfg)

	//mw for protected routes only
	protectedRoutes := chi.NewRouter()
	routes.Protected(protectedRoutes, h)
	protectedRouteHandler := negroni.New()
	// protectedRouteHandler.Use(negroni.HandlerFunc(middleware.Auth))
	protectedRouteHandler.UseHandler(protectedRoutes)

	//mw for every route
	unprotectedRoutes := chi.NewRouter()
	routes.Unprotected(unprotectedRoutes, h)
	n := negroni.Classic() // serves "./public"
	n.Use(middleware.Cors)
	n.Use(negroni.HandlerFunc(middleware.SetCacheControlHeader))
	n.UseHandler(unprotectedRoutes)

	unprotectedRoutes.Mount("/api", protectedRouteHandler)

	port, ok := os.LookupEnv("PORT")
	if !ok {
		port = "8000"
	}
	log.Println("server running on port " + port)

	srv := &http.Server{
		Handler:      n,
		Addr:         ":" + port,
		WriteTimeout: 10 * time.Second,
		ReadTimeout:  10 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
