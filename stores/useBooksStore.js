import { api } from "#imports"
import { defineStore } from "pinia"

export const useBooksStore = defineStore("books", {
  state: () => ({
    books: [],
    selectedBook: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchBooks() {
      this.loading = true
      this.error = null
      try {
        const res = await api().get("/books")
        if (res.status === 200) {
          this.books = res.data
        }
      } catch (error) {
        console.error("Error fetching books:", error)
        this.error = error.response?.data?.message || "Failed to fetch books"
      } finally {
        this.loading = false
      }
    },

    async fetchBookById(id) {
      this.loading = true
      this.error = null
      this.selectedBook = null
      try {
        const res = await api().get(`/books/${id}`)
        if (res.status === 200) {
          this.selectedBook = res.data
          console.log("Selected book:", this.selectedBook)
        }
      } catch (error) {
        console.error(`Error fetching book with ID ${id}:`, error)
        this.error = error.response?.data?.message || "Failed to fetch book"
      } finally {
        this.loading = false
      }
    },

    async addTranslation({ bookId, language, name, description }) {
      try {
        const res = await api().post("/Books/add-translation", {
          bookId,
          language,
          name,
          description,
        })

        if (this.selectedBook) {
          this.selectedBook.translations = {
            ...this.selectedBook.translations,
            [language]: res.data,
          }
        }
        
        return res.data
      } catch (error) {
        console.error("Error adding translation:", error)
        throw error.response?.data?.message || "Failed to add translation"
      }
    },

    async editTranslation({ id, language, name, description }) {
      try {
        const res = await api().put(`/Books/update-translation/${id}`, {
          language,
          name,
          description,
        })

        if (this.selectedBook) {
          this.selectedBook.translations[language] = res.data
        }
        
        return res.data
      } catch (error) {
        console.error("Error editing translation:", error)
        throw error.response?.data?.message || "Failed to update translation"
      }
    },

    async submitTranslation({ language, name, description }) {
      if (!this.selectedBook) {
        console.error("No selected book to update")
        
        return
      }

      const arTranslation = this.selectedBook.translations?.ar
      try {
        if (!arTranslation || arTranslation.name === "") {
          await this.addTranslation({
            bookId: this.selectedBook.id,
            language,
            name,
            description,
          })
        } else {
          await this.editTranslation({
            id: arTranslation.id,
            language,
            name,
            description,
          })
        }
      } catch (error) {
        console.error("Translation submission failed:", error)
      }
    },

    async deleteBook(bookId) {
      console.log("Deleting book with ID:", bookId)
      this.loading = true
      this.error = null
      try {
        const res = await api().delete(`/Books/${bookId}`)
        if (res.status === 200 || res.status === 204) {
          this.books = this.books.filter(book => book.id !== bookId)
          if (this.selectedBook && this.selectedBook.id === bookId) {
            this.selectedBook = null
          }
          console.log(`Book with ID ${bookId} deleted successfully`)
        }
      } catch (error) {
        console.error(`Error deleting book with ID ${bookId}:`, error)
        this.error = error.response?.data?.message || "Failed to delete book"
        throw error
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    totalBooks: state => state.books.length,
  },
})
