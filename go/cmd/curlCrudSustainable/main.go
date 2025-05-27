package main

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
)

var cookie, extractedClassID, extractedSetID, extractedID string
var err error

// Function to get the session cookie from the curl response
func getSessionCookie() (string, error) {
	// Run the curl command to capture the session cookie
	cmd := exec.Command("bash", "-c", `curl -i -sS -X POST https://cowboy-cards.dsouth.org/login -H "Content-Type: application/json" -d '{"email":"bob@example.com","password":"edededed"}'`)
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
func executeCurlWithCookie() (string, error) {
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

// Function to execute a curl command passed as a string with the extracted cookie
func executeCurlWithCookieFromString(curlTemplate string) (string, error) {
	// Replace the [cookie] placeholder in the template with the actual cookie value
	curlCommand := strings.Replace(curlTemplate, "[cookie]", cookie, 1)

	// Execute the final curl command
	cmd := exec.Command("bash", "-c", curlCommand)
	curlOutput, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("Error running curl: %v\nOutput: %s", err, curlOutput)
	}

	return string(curlOutput), nil
}

func main() {
	cookie, err = getSessionCookie()
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	// fmt.Println("Extracted cookie:", cookie)

	createSetAndClass()

	card_historyTest()
	class_setTest()
	class_userTest()
	classesTest()
	flashcard_setTest()
	flashcardTest()
	set_userTest()

	cleanUpSetAndClass()
}

func createSetAndClass() {
	// create the temp class to own
	curlTemplate := `curl -X POST --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/classes/ -sS -H "class_name: Testing Curls" -H "class_description: One moment"`

	curlOutput, err := executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}

	// re will be used several times as the layout of 'id' is similar for many necessary cases
	re := regexp.MustCompile(`"ID"\s*:\s*(\d+)`)
	match := re.FindStringSubmatch(curlOutput)

	if len(match) > 1 {
		extractedClassID = match[1] // store the ID directly
	} else {
		fmt.Println("ID not found")
		return
	}

	// verify id manually
	// fmt.Println("Creating Class " + extractedClassID)

	// create a set for use in testing
	curlTemplate = `curl -X POST --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/flashcards/sets -sS -H "set_name: testDelete" -H "set_description: one moment"`

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}

	match = re.FindStringSubmatch(curlOutput)

	// grab the set id for later use
	// var extractedSetID string // <-- now it's a string

	if len(match) > 1 {
		extractedSetID = match[1] // store the ID directly
	} else {
		fmt.Println("ID not found")
		return
	}

	// fmt.Println("Creating Set " + extractedSetID)
	// fmt.Println(curlOutput)
}

func card_historyTest() {
	// this will create the flashcard we need for testing
	curlTemplate := fmt.Sprintf(
		`curl -X POST --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/flashcards/ -sS -H "front: test front" -H "back: back test" -H "set_id: %s"`,
		extractedSetID,
	)

	curlOutput, err := executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}

	re := regexp.MustCompile(`"ID"\s*:\s*(\d+)`)
	match := re.FindStringSubmatch(curlOutput)

	if len(match) > 1 {
		extractedID = match[1]
	} else {
		fmt.Println("ID not found")
		return
	}

	// test for history/correct
	curlTemplate = fmt.Sprintf(
		`curl -X POST --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/card_history/correct -sS -H "card_id: %s"`,
		extractedID,
	)

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}

	curlTemplate = fmt.Sprintf(
		`curl -X GET --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/card_history/ -sS -H "card_id: %s"`,
		extractedID,
	)

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}

	re = regexp.MustCompile(`"Correct"\s*:\s*(\d+)`)
	match = re.FindStringSubmatch(curlOutput)

	if len(match) > 1 {
		if match[1] != "1" {
			fmt.Println("wrong score value (correct)")
			return
		}
		// fmt.Println(curlOutput + "correct :)")
	} else {
		fmt.Println("score not found")
		return
	}

	// test for history/incorrect
	curlTemplate = fmt.Sprintf(
		`curl -X POST --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/card_history/incorrect -sS -H "card_id: %s"`,
		extractedID,
	)

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}

	curlTemplate = fmt.Sprintf(
		`curl -X GET --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/card_history/ -sS -H "card_id: %s"`,
		extractedID,
	)

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}

	re = regexp.MustCompile(`"Incorrect"\s*:\s*(\d+)`)
	match = re.FindStringSubmatch(curlOutput)

	if len(match) > 1 {
		if match[1] != "1" {
			fmt.Println("wrong score value (incorrect)")
			return
		}
		// fmt.Println(curlOutput + "incorrect :)")
	} else {
		fmt.Println("score not found")
		return
	}

	curlTemplate = fmt.Sprintf(
		`curl -X GET --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/card_history/set -sS -H "set_id: %s" -H "user_id: 3"`,
		extractedSetID,
	)

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}

	type SetResult struct {
		SetName        string `json:"SetName"`
		Correct        int    `json:"Correct"`
		Incorrect      int    `json:"Incorrect"`
		NetScore       int    `json:"NetScore"`
		TimesAttempted int    `json:"TimesAttempted"`
	}

	var results []SetResult
	err = json.Unmarshal([]byte(curlOutput), &results)
	if err != nil {
		fmt.Println("Error parsing JSON:", err)
		return
	}

	if len(results) > 0 {
		if results[0].SetName != "testDelete" {
			fmt.Println("unexpected setName")
			return
		}
		if results[0].Correct != 1 {
			fmt.Println("value of correct unexpected")
			return
		}
		if results[0].Incorrect != 1 {
			fmt.Println("value of incorrect unexpected")
			return
		}
		if results[0].NetScore != 1 {
			fmt.Println("value of netscore unexpected")
			return
		}
		if results[0].TimesAttempted != 2 {
			fmt.Println("value of timesattempted unexpected")
			return
		}
	} else {
		fmt.Println("No Data returned by getScoresInaSet")
	}

	// delete flashcard
	curlTemplate = `curl -X DELETE --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/flashcards -sS -H "id: ` + extractedID + `"`

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Print(curlOutput)
		return
	}

	fmt.Println("Card_history was successful")

}

func class_setTest() {

	//add set to class
	curlTemplate := fmt.Sprintf(
		`curl -X POST --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/class_set -sS -H "id: %s" -H "set_id: %s"`,
		extractedClassID,
		extractedSetID,
	)

	curlOutput, err := executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}

	// list sets in a class
	curlTemplate = fmt.Sprintf(
		`curl -X GET --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/class_set/list_sets -sS -H "id: %s"`,
		extractedClassID,
	)

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}

	type SetResult struct {
		ID             int    `json:"ID"`
		SetName        string `json:"SetName"`
		SetDescription string `json:"SetDescription"`
	}

	var results []SetResult
	err = json.Unmarshal([]byte(curlOutput), &results)
	if err != nil {
		fmt.Println("Error parsing JSON:", err)
		return
	}

	if len(results) > 0 {
		if strconv.Itoa(results[0].ID) != extractedSetID {
			fmt.Println("unexpected set ID for sets in class")
			return
		}
		if results[0].SetName != "testDelete" {
			fmt.Println("unexpected setName for sets in class")
			return
		}
		if results[0].SetDescription != "one moment" {
			fmt.Println("unexpected SetDescription for sets in class")
			return
		}
	}

	// list classes with set
	curlTemplate = fmt.Sprintf(
		`curl -X GET --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/class_set/list_classes -sS -H "set_id: %s"`,
		extractedSetID,
	)

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}

	type SetResultClass struct {
		ID               int    `json:"ID"`
		ClassName        string `json:"ClassName"`
		ClassDescription string `json:"ClassDescription"`
	}

	var resultsClass []SetResultClass
	err = json.Unmarshal([]byte(curlOutput), &resultsClass)
	if err != nil {
		fmt.Println("Error parsing JSON:", err)
		return
	}

	if len(resultsClass) > 0 {
		if strconv.Itoa(resultsClass[0].ID) != extractedClassID {
			fmt.Println("unexpected classID")
			return
		}
		if resultsClass[0].ClassName != "Testing Curls" {
			fmt.Println("unexpected class name for class with sets")
			return
		}
		if resultsClass[0].ClassDescription != "One moment" {
			fmt.Println("unexpected class Description for class with sets")
			return
		}
	}

	//remove set from class
	curlTemplate = fmt.Sprintf(
		`curl -X DELETE --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/class_set -sS -H "id: %s" -H "set_id: %s"`,
		extractedClassID,
		extractedSetID,
	)

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}
	if curlOutput != "" {
		fmt.Println("failed to remove set")
		return
	}

	fmt.Println("Class_set was successful")
}

func class_userTest() {
	// use a temporary user for a controlled test environment

	// curlTemplate := (`curl -i -s -X POST https://cowboy-cards.dsouth.org/signup -H "Content-Type: application/json" -d '{"username":"tempUser","email":"temp@temporary.com","password":"Testing123!", "first_name":"temp", "last_name":"temporary"}'`)
	var realCookie string = cookie
	cookie = "MTc0NTg5OTY4NnxEWDhFQVFMX2dBQUJFQUVRQUFCa180QUFBd1p6ZEhKcGJtY01Ed0FOWVhWMGFHVnVkR2xqWVhSbFpBUmliMjlzQWdJQUFRWnpkSEpwYm1jTUNRQUhkWE5sY2w5cFpBVnBiblF6TWdRQ0FGNEdjM1J5YVc1bkRBd0FDbU55WldGMFpXUmZZWFFGYVc1ME5qUUVCZ0Q4MENDaFRBPT18fgeLOgENGTBUvyqzregN4g81QxO4VdKoaJW1HTp9hLk="

	// join class
	curlTemplate := fmt.Sprintf(
		`curl -X POST --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/class_user -sS -H "class_id: %s" -H "role: student"`,
		extractedClassID,
	)

	curlOutput, err := executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}

	// list classes of a user
	curlTemplate = `curl -X GET --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/class_user/classes -sS -H "user_id: 47"`

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}

	type SetResult struct {
		ClassID          int    `json:"ClassID"`
		Role             string `json:"Role"`
		ClassName        string `json:"ClassName"`
		ClassDescription string `json:"ClassDescription"`
	}

	var results []SetResult
	err = json.Unmarshal([]byte(curlOutput), &results)
	if err != nil {
		fmt.Println("Error parsing JSON:", err)
		return
	}

	if len(results) > 0 {
		if strconv.Itoa(results[0].ClassID) != extractedClassID {
			fmt.Println("unexpected Class ID for class_user")
			return
		}
		if results[0].Role != "student" {
			fmt.Println("unexpected role")
			return
		}
		if results[0].ClassName != "Testing Curls" {
			fmt.Println("unexpected classname")
			return
		}
		if results[0].ClassDescription != "One moment" {
			fmt.Println("unexpected classDescription")
			return
		}
	}

	// list members of a class
	curlTemplate = fmt.Sprintf(
		`curl -X GET --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/class_user/members -sS -H "class_id: %s"`,
		extractedClassID,
	)
	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}

	type SetResultClass struct {
		UserID    int    `json:"UserID"`
		ClassID   int    `json:"ClassID"`
		Role      string `json:"Role"`
		FirstName string `json:"FirstName"`
		LastName  string `json:"LastName"`
		Username  string `json:"Username"`
	}

	var resultsClass []SetResultClass
	err = json.Unmarshal([]byte(curlOutput), &resultsClass)
	if err != nil {
		fmt.Println("Error parsing JSON:", err)
		return
	}

	if len(resultsClass) > 0 {
		if strconv.Itoa(resultsClass[0].UserID) != "3" {
			fmt.Println("unexpected Class ID for class_user")
			return
		}
		if strconv.Itoa(resultsClass[0].ClassID) != extractedClassID {
			fmt.Println("unexpected Class ID for class_user")
			return
		}
		if resultsClass[0].Role != "teacher" {
			fmt.Println("unexpected setName for sets in class")
			return
		}
		if resultsClass[0].FirstName != "Bob" {
			fmt.Println("unexpected SetDescription for sets in class")
			return
		}
		if resultsClass[0].LastName != "Johnson" {
			fmt.Println("unexpected SetDescription for sets in class")
			return
		}
		if resultsClass[0].Username != "bob_johnson" {
			fmt.Println("unexpected SetDescription for sets in class")
			return
		}
	} else {
		fmt.Println("failed to enter class")
	}

	// leave class
	curlTemplate = `curl -s -X DELETE --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/class_user/ -H "class_id: ` + extractedClassID + `" -H "student_id: 47"`

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}
	fmt.Print(curlOutput)

	// fmt.Print(curlOutput)

	// reset cookie
	cookie = realCookie

	fmt.Println("Class_user was successful")
}

func classesTest() {
	//create class
	curlTemplate := `curl -X POST --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/classes/ -sS -H "class_name: Testing Class" -H "class_description: Update Me"`

	curlOutput, err := executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}

	re := regexp.MustCompile(`"ID"\s*:\s*(\d+)`)
	match := re.FindStringSubmatch(curlOutput)
	var tempClassID string

	if len(match) > 1 {
		tempClassID = match[1] // store the ID directly
	} else {
		fmt.Println("ID not found")
		return
	}

	// fmt.Print(curlOutput)

	// update class
	curlTemplate = fmt.Sprintf(
		`curl -X PUT --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/classes/class_description -sS -H "id: %s" -H "class_description: Delete Me"`,
		tempClassID,
	)
	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}

	// get class by id (verify update)
	curlTemplate = fmt.Sprintf(
		`curl -X GET --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/classes/ -sS -H "id: %s"`,
		tempClassID,
	)

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}

	re = regexp.MustCompile(`"ClassDescription"\s*:\s*"([^"]+)"`)
	match = re.FindStringSubmatch(curlOutput)

	if len(match) > 1 {
		if match[1] != "Delete Me" {
			fmt.Println("Description Update fail")
			return
		}
	} else {
		fmt.Println("ID not found")
		return
	}

	// show leaderboard
	curlTemplate = fmt.Sprintf(
		`curl -X GET --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/classes/leaderboard/ -sS -H "id: %s"`,
		"8",
	)

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}

	fmt.Print(curlOutput)

	// delete class
	curlTemplate = fmt.Sprintf(
		`curl -X DELETE --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/classes/ -sS -H "id: %s"`,
		tempClassID,
	)

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}

	fmt.Println("Classes was successful")

}

func flashcard_setTest() {
	// create flashcard set
	curlTemplate := `curl -X POST --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/flashcards/sets -sS -H "set_name: testDelete" -H "set_description: Update Me"`

	curlOutput, err := executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}

	// fmt.Print(curlOutput)

	re := regexp.MustCompile(`"ID"\s*:\s*(\d+)`)
	match := re.FindStringSubmatch(curlOutput)
	var tempSetID string

	if len(match) > 1 {
		tempSetID = match[1] // store the ID directly
	} else {
		fmt.Println("ID not found")
		return
	}

	// update flashcard set
	curlTemplate = fmt.Sprintf(
		`curl -X PUT --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/flashcards/sets/set_description -sS -H "set_description: Delete Me" -H "id: %s"`,
		tempSetID,
	)

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	// fmt.Print(curlOutput)

	// get flashcard set (and verify update)
	curlTemplate = fmt.Sprintf(
		`curl -X GET --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/flashcards/sets/ -sS -H "id: %s"`,
		tempSetID,
	)

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	// fmt.Print(curlOutput)

	re = regexp.MustCompile(`"SetDescription"\s*:\s*"([^"]+)"`)
	match = re.FindStringSubmatch(curlOutput)

	if len(match) > 1 {
		if match[1] != "Delete Me" {
			fmt.Println("Description Update fail")
			return
		}
	} else {
		fmt.Println("ID not found")
		return
	}

	// delete flashcard set
	curlTemplate = fmt.Sprintf(
		`curl -X DELETE --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/flashcards/sets/ -sS -H "id: %s"`,
		tempSetID,
	)

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	fmt.Println("flashcard_sets was successful")
}

func flashcardTest() {
	// create flashcard
	curlTemplate := fmt.Sprintf(
		`curl -X POST --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/flashcards/ -sS -H "front: test front" -H "back: back test" -H "set_id: %s"`,
		extractedSetID,
	)

	curlOutputInitial, err := executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	re := regexp.MustCompile(`"ID"\s*:\s*(\d+)`)
	match := re.FindStringSubmatch(curlOutputInitial)

	if len(match) > 1 {
		extractedID = match[1]
	} else {
		fmt.Println("ID not found")
		return
	}

	// update flashcard front
	curlTemplate = fmt.Sprintf(
		`curl -X PUT --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/flashcards/front -sS -H "front: Who is Don Quixote?" -H "id: %s"`,
		extractedID,
	)

	curlOutput, err := executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Print(curlOutput)
		return
	}

	// get flashcard by id (and verify update)
	curlTemplate = fmt.Sprintf(
		`curl -X GET --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/flashcards/ -sS -H "id: %s"`,
		extractedID,
	)

	curlOutputConfirm, err := executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	if curlOutputConfirm == curlOutputInitial {
		fmt.Println("Card not updated")
		return
	}

	curlTemplate = fmt.Sprintf(
		`curl -X GET --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/flashcards/list -sS -H "set_id: %s"`,
		extractedSetID,
	)

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Print(curlOutput)
		return
	}

	match = re.FindStringSubmatch(curlOutput)

	if len(match) > 1 {
		if match[1] != extractedID {
			fmt.Println("wrong set/flashcard retrieved")
			// return
			fmt.Print(curlOutput)
		}
	} else {
		fmt.Println("ID not found")
		return
	}

	// delete flashcard
	curlTemplate = `curl -X DELETE --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/flashcards -sS -H "id: ` + extractedID + `"`

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Print(curlOutput)
		return
	}

	fmt.Println("Flashcard successful")
}

func set_userTest() {
	var realCookie string = cookie
	cookie = "MTc0NTg5OTY4NnxEWDhFQVFMX2dBQUJFQUVRQUFCa180QUFBd1p6ZEhKcGJtY01Ed0FOWVhWMGFHVnVkR2xqWVhSbFpBUmliMjlzQWdJQUFRWnpkSEpwYm1jTUNRQUhkWE5sY2w5cFpBVnBiblF6TWdRQ0FGNEdjM1J5YVc1bkRBd0FDbU55WldGMFpXUmZZWFFGYVc1ME5qUUVCZ0Q4MENDaFRBPT18fgeLOgENGTBUvyqzregN4g81QxO4VdKoaJW1HTp9hLk="

	curlTemplate := `curl -X POST --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/flashcards/sets -sS -H "set_name: testDelete" -H "set_description: Update Me"`

	curlOutput, err := executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}
	re := regexp.MustCompile(`"ID"\s*:\s*(\d+)`)
	match := re.FindStringSubmatch(curlOutput)
	var tempSetID string

	if len(match) > 1 {
		tempSetID = match[1] // store the ID directly
	} else {
		fmt.Println("ID not found")
		return
	}

	cookie = realCookie

	// join set
	curlTemplate = fmt.Sprintf(
		`curl -X POST --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/set_user -sS -H "role:owner" -H "set_id: %s"`,
		tempSetID,
	)

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	// fmt.Print(curlOutput)

	// lists sets of a user
	curlTemplate = `curl -X GET --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/set_user/list -sS -H "id: 3"`

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	// fmt.Print(curlOutput)

	// leave set
	curlTemplate = fmt.Sprintf(
		`curl -X DELETE --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/set_user/ -sS -H "set_id: %s"`,
		tempSetID,
	)

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	// fmt.Print(curlOutput)

	cookie = "MTc0NTg5OTY4NnxEWDhFQVFMX2dBQUJFQUVRQUFCa180QUFBd1p6ZEhKcGJtY01Ed0FOWVhWMGFHVnVkR2xqWVhSbFpBUmliMjlzQWdJQUFRWnpkSEpwYm1jTUNRQUhkWE5sY2w5cFpBVnBiblF6TWdRQ0FGNEdjM1J5YVc1bkRBd0FDbU55WldGMFpXUmZZWFFGYVc1ME5qUUVCZ0Q4MENDaFRBPT18fgeLOgENGTBUvyqzregN4g81QxO4VdKoaJW1HTp9hLk="

	curlTemplate = fmt.Sprintf(
		`curl -X DELETE --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/flashcards/sets/ -sS -H "id: %s"`,
		tempSetID,
	)

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	cookie = realCookie
	fmt.Println("Set_user was successful")
}

func cleanUpSetAndClass() {
	// deletes the used set to keep the database clean
	curlTemplate := `curl -X DELETE --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/flashcards/sets -sS -H "id:` + extractedSetID + `"`

	curlOutput, err := executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}

	// fmt.Println("Deleting set " + extractedSetID)

	// deletes the used class to keep the database clean
	curlTemplate = `curl -X DELETE --cookie "cowboy-cards-session=[cookie]" https://cowboy-cards.dsouth.org/api/classes/ -sS -H "id:` + extractedClassID + `"`

	curlOutput, err = executeCurlWithCookieFromString(curlTemplate)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(curlOutput)
		return
	}

	// fmt.Println("Deleting class " + extractedClassID)
}
