package main

import (
	"fmt"
	"os"
	"os/exec"
	"regexp"
	"strings"
)

// Function to get the session cookie from the curl response
func getSessionCookie() (string, error) {
	// Run the curl command to capture the session cookie
	cmd := exec.Command("bash", "-c", `curl -i -s -X POST https://cowboy-cards.dsouth.org/login -H "Content-Type: application/json" -d '{"email":"bob@example.com","password":"edededed"}'`)
	output, err := cmd.Output()
	if err != nil {
		return "", fmt.Errorf("Error running curl: %v", err)
	}

	// Convert output to string
	result := string(output)

	// Use regex to extract the cookie value after 'cowboy-cards-session='
	re := regexp.MustCompile(`cowboy-cards-session=([A-Za-z0-9\-_=]+)=`)
	match := re.FindStringSubmatch(result)
	if len(match) < 2 {
		return "", fmt.Errorf("No session cookie found")
	}

	// Extract the cookie value and append '=' to match the full session cookie value
	cookie := match[1] + "="
	return cookie, nil
}

// Function to execute the curl command with the extracted cookie
func executeCurlWithCookie(cookie string) (string, error) {
	// Read the curl template from a file
	curlTemplate, err := os.ReadFile("go/cmd/curlrunner/curlTemplate.txt")
	if err != nil {
		return "", fmt.Errorf("Failed to read curl template: %v", err)
	}

	// Replace the [cookie] placeholder in the template with the actual cookie value
	curlCommand := strings.Replace(string(curlTemplate), "[cookie]", cookie, 1)

	//fmt.Println(curlCommand)

	// Execute the final curl command
	cmd := exec.Command("bash", "-c", curlCommand)
	curlOutput, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("Error running curl: %v", err)
	}

	return string(curlOutput), nil
}

func main() {
	// Step 1: Get the session cookie
	cookie, err := getSessionCookie()
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	// fmt.Println("Extracted cookie:", cookie)

	// Step 2: Execute the curl command with the extracted cookie
	curlOutput, err := executeCurlWithCookie(cookie)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	// Print the result of the final curl command
	fmt.Println("Final curl command output:")
	fmt.Println(curlOutput)
}
