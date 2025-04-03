# Start from the latest golang base image
FROM golang:latest

# Add Maintainer Info
LABEL maintainer="James South"

# Set the Current Working Directory inside the container
WORKDIR /

# Copy the source from the current directory to the Working Directory inside the container
COPY . .

# Disable Go Modules
# ENV GO111MODULE=off

# Build the Go app
RUN go build -o main ./go

# Expose port 8090 to the outside world
EXPOSE 8090

# Command to run the executable
CMD ["./main"]