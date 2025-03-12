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
		log.Fatalf("env vars not loaded")
	}

	config, err := pgxpool.ParseConfig(dburl)
	if err != nil {
		log.Fatalf("error parsing config: %v", err)
	}

	config.ConnConfig.User = dbuser
	config.ConnConfig.Host = dbhost

	return
}

func CreatePool(config *pgxpool.Config) (pool *controllers.Pool) {
	ctx := context.Background()

	pgpool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		log.Fatalf("error creating connection pool: %v", err)
	}

	if err := pgpool.Ping(ctx); err != nil {
		log.Fatalf("error connecting to database: %v", err)
	}

	log.Println("Successfully connected to database")

	pool = &controllers.Pool{DB: pgpool}

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

func Init() {
	cfg := LoadPoolConfig()
	pool := CreatePool(cfg)

	n := negroni.New()
	n.Use(negroni.NewLogger())
	n.Use(negroni.NewRecovery())
	n.Use(negroni.HandlerFunc(setCacheControlHeader))
	n.Use(negroni.NewStatic(http.Dir("./dist")))

	r := chi.NewRouter()
	routes.Routes(r, pool)

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
