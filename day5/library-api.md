# Library Books REST API Design

Base URL: `https://api.example.com`

Resource: **books** represents a book in the library.

Book object:
- id: number
- title: string
- author: string
- isbn: string
- publishedYear: number
- available: boolean

---

## Endpoints

### 1. List all books
- **Method:** GET
- **Path:** /books
- **Description:** Get a list of all books in the library.
- **Request Body:** None
- **Success Status:** 200 OK
- **Example Response:** Returns array of books

### 2. Get one book by ID
- **Method:** GET
- **Path:** /books/{id}
- **Description:** Get a single book by its ID.
- **Request Body:** None
- **Success Status:** 200 OK

### 3. Create a new book
- **Method:** POST
- **Path:** /books
- **Description:** Add a new book to the library.
- **Request Body:**
```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "isbn": "978-0385474542",
  "publishedYear": 1958,
  "available": true
}

