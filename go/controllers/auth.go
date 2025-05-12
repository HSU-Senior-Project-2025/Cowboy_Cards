package controllers

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/smtp"
	"os"
	"strings"
	"time"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/middleware"
	"github.com/jackc/pgx/v5/pgtype"
	"golang.org/x/crypto/bcrypt"
)

// Login handles user authentication
func (h *DBHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logAndSendError(w, err, "Invalid request body", http.StatusBadRequest)
		return
	}

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	user, err := query.GetUserByEmail(ctx, req.Email)
	if err != nil {
		logAndSendError(w, err, "Invalid email", http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		logAndSendError(w, err, "Invalid password", http.StatusUnauthorized)
		return
	}

	// Create session cookie
	err = middleware.CreateSession(w, r, user.ID)
	if err != nil {
		logAndSendError(w, err, "Error creating session", http.StatusInternalServerError)
		return
	} else {
		// login and streak
		err = query.UpdateLastLogin(ctx, user.ID)
		if err != nil {
			logAndSendError(w, err, "update error", http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode("resp"); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

// Signup handles user registration
func (h *DBHandler) Signup(w http.ResponseWriter, r *http.Request) {
	var req SignupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logAndSendError(w, err, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.Username == "" || req.Email == "" || req.Password == "" || req.FirstName == "" || req.LastName == "" {
		logAndSendError(w, errors.New("empty fields submitted"), "All fields are required", http.StatusBadRequest)
		return
	}

	if err := CheckPasswordStrength(req.Password); err != nil {
		logAndSendError(w, err, "Password strength error", http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		logAndSendError(w, err, "Error hashing password", http.StatusInternalServerError)
		return
	}

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	// Check if username already exists
	_, err = query.GetUserByUsername(ctx, req.Username)
	if err == nil {
		logAndSendError(w, err, "Username already exists", http.StatusConflict)
		return
	} else if !strings.Contains(err.Error(), "no rows") {
		logAndSendError(w, err, "Error checking username", http.StatusInternalServerError)
		return
	}

	// Check if email already exists
	_, err = query.GetUserByEmail(ctx, req.Email)
	if err == nil {
		logAndSendError(w, err, "Email already exists", http.StatusConflict)
		return
	} else if !strings.Contains(err.Error(), "no rows") {
		logAndSendError(w, err, "Error checking email", http.StatusInternalServerError)
		return
	}

	params := db.CreateUserParams{
		Username:  req.Username,
		Email:     req.Email,
		Password:  string(hashedPassword),
		FirstName: req.FirstName,
		LastName:  req.LastName,
	}

	user, err := query.CreateUser(ctx, params)
	if err != nil {
		logAndSendError(w, err, "Failed to create user", http.StatusInternalServerError)
		return
	}

	// Create session cookie
	if err := middleware.CreateSession(w, r, user.ID); err != nil {
		logAndSendError(w, err, "Error creating session", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode("resp"); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *DBHandler) SendResetPasswordToken(w http.ResponseWriter, r *http.Request) {
	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, email)
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	user, err := query.GetUserByEmail(ctx, headerVals[email])
	if err != nil {
		logAndSendError(w, err, "Invalid email", http.StatusUnauthorized)
		return
	}

	resetToken, err := generateUniqueToken()
	if err != nil {
		http.Error(w, "Failed to generate reset token", http.StatusInternalServerError)
		return
	}

	emailBody := fmt.Sprintf(`
Howdy Partner!

You've requested a password reset for Cowboy Cards. To reset your password, please copy the following token:
%s

This token will expire in 1 hour.

If you did not request this password reset, please ignore this email.

Yeehaw!
The Cowboy Cards Team
	`, resetToken)

	// Store the reset token in the database
	err = query.CreateResetToken(ctx, db.CreateResetTokenParams{
		ResetToken: pgtype.Text{String: resetToken, Valid: true},
		ID:         user.ID,
	})
	if err != nil {
		logAndSendError(w, err, "Error creating token", http.StatusUnauthorized)
		return
	}

	if err := SendEmail(w, headerVals[email], "Cowboy Cards Password Reset", emailBody); err != nil {
		http.Error(w, "Failed to send password reset email", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
  w.Write([]byte(`{"success": true}`))
}

func (h *DBHandler) ResetPassword(w http.ResponseWriter, r *http.Request) {
	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, password, token, email)
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	user, err := query.GetUserByEmail(ctx, headerVals[email])
	if err != nil {
		logAndSendError(w, err, "Invalid email", http.StatusUnauthorized)
		return
	}

	if user.ResetToken.String != headerVals[token] {
		logAndSendError(w, err, "Invalid reset token", http.StatusUnauthorized)
		return
	}

	if time.Now().After(user.UpdatedAt.Time.Add(time.Hour)) {
		logAndSendError(w, err, "Reset token expired", http.StatusUnauthorized)
		return
	}

	if err := CheckPasswordStrength(headerVals[password]); err != nil {
		logAndSendError(w, err, "Password strength error", http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(headerVals[password]), bcrypt.DefaultCost)
	if err != nil {
		logAndSendError(w, err, "Error hashing password", http.StatusInternalServerError)
		return
	}

	err = query.UpdatePasswordAndClearResetToken(ctx, db.UpdatePasswordAndClearResetTokenParams{
		ID:       user.ID,
		Password: string(hashedPassword),
	})
	if err != nil {
		logAndSendError(w, err, "Failed to update password", http.StatusBadRequest)
		return
	}
}

func generateUniqueToken() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

func SendEmail(w http.ResponseWriter, to, subject, body string) error {
	fmt.Println(os.Getenv("SMTP_USERNAME"), os.Getenv("SMTP_PASSWORD"), os.Getenv("SMTP_HOST"), os.Getenv("SMTP_PORT"))
	from := os.Getenv("SMTP_USERNAME")
	password := os.Getenv("SMTP_PASSWORD")
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")

	auth := smtp.PlainAuth("", from, password, smtpHost)

	message := fmt.Appendf(nil, "To: %s\r\nSubject: %s\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n%s\r\n", to, subject, body)

	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, message)
	if err != nil {
		logAndSendError(w, err, "Error sending email", http.StatusBadRequest)
		return err
	}
	return nil
}

func CheckPasswordStrength(password string) error {
	minLength := 8
	if len(password) < minLength {
		return fmt.Errorf("password must be at least %d characters long", minLength)
	}

	hasUpper := false
	hasLower := false
	hasDigit := false
	hasSpecial := false

	for _, char := range password {
		switch {
		case char >= 'A' && char <= 'Z':
			hasUpper = true
		case char >= 'a' && char <= 'z':
			hasLower = true
		case char >= '0' && char <= '9':
			hasDigit = true
		case strings.ContainsRune("!@#$%^&*()_-+={}[]|;:<>,.?/~`", char):
			hasSpecial = true
		}
	}

	if !hasUpper {
		return fmt.Errorf("password must contain at least one uppercase letter")
	}
	if !hasLower {
		return fmt.Errorf("password must contain at least one lowercase letter")
	}
	if !hasDigit {
		return fmt.Errorf("password must contain at least one digit")
	}
	if !hasSpecial {
		return fmt.Errorf("password must contain at least one special character")
	}

	return nil
}
