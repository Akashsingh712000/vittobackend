# Vitto Backend

## Overview

This project part is backend of an AI-first BFSI website with backend APIs for OTP
authentication and lead management.

## Tech Stack

-   Backend: Node.js + Express
-   Databases: MongoDB (TTL OTP), PostgreSQL (Leads)

## API Endpoints

-   POST /api/auth/send-otp
-   POST /api/auth/verify-otp
-   POST /api/leads
-   GET /api/leads/:id

## Setup

1.  Install dependencies
2.  Add .env file
3.  Run backend: npm run dev
4.  Run frontend: npm run dev

## Features

-   OTP authentication with TTL
-   Lead storage in PostgreSQL could not connect
-   Clean modular architecture
