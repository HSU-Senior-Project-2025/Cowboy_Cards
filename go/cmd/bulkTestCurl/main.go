package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
)

// This gets the directory where this .go file lives
func getScriptDir() string {
	_, filename, _, _ := runtime.Caller(0)
	return filepath.Dir(filename)
}

func main() {
	// Path to the curlTemplate.txt file
	templatePath := filepath.Join(getScriptDir(), "curls.txt")

	// Open the file
	file, err := os.Open(templatePath)
	if err != nil {
		log.Fatal("Failed to open curlTemplate.txt:", err)
	}
	defer file.Close()

	// Example cookie value
	cookie := "MTc0NDY5MjQ0N3xEWDhFQVFMX2dBQUJFQUVRQUFCa180QUFBd1p6ZEhKcGJtY01Ed0FOWVhWMGFHVnVkR2xqWVhSbFpBUmliMjlzQWdJQUFRWnpkSEpwYm1jTUNRQUhkWE5sY2w5cFpBVnBiblF6TWdRQ0FBWUdjM1J5YVc1bkRBd0FDbU55WldGMFpXUmZZWFFGYVc1ME5qUUVCZ0Q4el92SnZnPT186oJEDN5sA2WqBPaIM4nQz-qVwNGYU68KFDW8IcoVJKo="

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		if strings.TrimSpace(line) == "" {
			continue // skip empty lines
		}

		// Replace [cookie] with actual value
		curlCommand := strings.Replace(line, "[cookie]", cookie, 1)

		// Run the curl command
		//fmt.Println("Running:", curlCommand)
		cmd := exec.Command("bash", "-c", curlCommand)
		output, err := cmd.CombinedOutput()
		if err != nil {
			fmt.Println("Error:", err)
		}
		fmt.Println(string(output))
	}

	if err := scanner.Err(); err != nil {
		log.Fatal("Error reading file:", err)
	}
}
