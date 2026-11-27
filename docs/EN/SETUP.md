# Installation and Execution Guide

This document explains how to set up and run the Comércio do Bairro project on the computer used for the presentation.

## 1. Prerequisites

Install the following programs:

| Tool | Purpose |
|---|---|
| Java JDK 21 | Run the backend |
| PostgreSQL | Manage the database |
| Ollama | Run the AI model locally |
| Node.js | Run the frontend |
| Git | Clone and update the project |

## 2. Get the project

Clone the repository:

bash
git clone REPOSITORY_URL


Enter the folder:

bash
cd PROJECT_NAME


## 3. Set up the Artificial Intelligence

Install Ollama and download the model used by the project:

bash
ollama pull qwen2.5vl:3b


Verify that the model was installed:

bash
ollama list


Ollama must be running for the backend to use the AI.

## 4. Set up the database

1. Install and start PostgreSQL.
2. Create the project database.
3. Run the SQL script located in database/schema.sql.
4. Configure the access credentials in the backend.

## 5. Run the backend

Enter the backend folder:

bash
cd backend


Run:

powershell
.\mvnw.cmd spring-boot:run


The backend will be available on port 8080.

## 6. Run the frontend

Instructions for installing dependencies and initializing the frontend will be added after defining the final commands and configurations for the project.

## 7. Access the system

After starting the backend and frontend, access the address provided by the server in your browser.

To access from other devices, they need to be able to communicate with the server computer over the network.

## 8. Important Notes

- PostgreSQL and Ollama must be running on the server computer.
- The backend is responsible for communicating with the database and the AI service.
- The frontend must consume the backend APIs.
- The AI model runs locally and does not need an external connection to generate descriptions after installation.
- Do not expose PostgreSQL or Ollama directly to the internet.
- Credentials and sensitive configurations should not be shared in the repository.
