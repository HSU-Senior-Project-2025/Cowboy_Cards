package app

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"path"
	"time"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/controllers"
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/routes"
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/joho/godotenv/autoload"
	"github.com/urfave/negroni/v3"
)

func LoadPoolConfig() (*controllers.Config, error) {
	var (
		dburl  = os.Getenv("DATABASE_URL")
		dbuser = os.Getenv("DBUSER")
		dbhost = os.Getenv("DBHOST")
	)

	if dburl == "" || dbuser == "" || dbhost == "" {
		return nil, errors.New("env vars not available")
	}

	config, err := pgxpool.ParseConfig(dburl)
	if err != nil {
		return nil, fmt.Errorf("error parsing config: %v", err)
	}
	config.ConnConfig.User = dbuser
	config.ConnConfig.Host = dbhost

	// pool, err := pgxpool.NewWithConfig(context.Background(), config)
	// if err != nil {
	// 	log.Fatalf("error creating connection pool: %v", err)
	// }
	// if err := pool.Ping(ctx); err != nil {
	// 	log.Fatalf("error connecting to database: %v", err)
	// }
	// log.Println("Successfully connected to database")

	// Enable SSL for Supabase
	// conn.TLSConfig = &tls.Config{
	// 	MinVersion: tls.VersionTLS12,
	// }

	cfg := &controllers.Config{
		DB: config,
	}

	return cfg, nil
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

func Init() {
	cfg, err := LoadPoolConfig()
	if err != nil {
		log.Fatalf("error getting config: %v", err)
	}

	n := negroni.New()
	n.Use(negroni.NewLogger())
	n.Use(negroni.NewRecovery())
	n.Use(negroni.HandlerFunc(setCacheControlHeader))
	n.Use(negroni.NewStatic(http.Dir("./dist")))

	r := chi.NewRouter()
	routes.Routes(r, cfg)

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
