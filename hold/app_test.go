package app

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGetClasses(t *testing.T) {
	t.Run("gets all classes", func(t *testing.T) {
		request, _ := http.NewRequest(http.MethodGet, "/classes", nil)
		response := httptest.NewRecorder()

		PlayerServer(response, request)

		got := response.Body.String()
		want := "20"

		if got != want {
			t.Errorf("got %q, want %q", got, want)
		}
	})
}
