import { api } from '#imports'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useBooksStore = defineStore('books', () => {
  const books = ref([])
  const selectedBook = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const snackbar = useSnackbarStore()

  const fetchBooks = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await api().get('/books')
      if (res.status === 200) {
        books.value = res.data
      }
    } catch (err) {
      console.error('Error fetching books:', err)
      error.value = err.response?.data?.message || 'Failed to fetch books'
    } finally {
      loading.value = false
    }
  }

  const fetchBookById = async id => {
    loading.value = true
    error.value = null
    selectedBook.value = null
    try {
      const res = await api().get(`/books/${id}`)
      if (res.status === 200) {
        selectedBook.value = res.data
      }
    } catch (err) {
      console.error(`Error fetching book with ID ${id}:`, err)
      error.value = err.response?.data?.message || 'Failed to fetch book'
    } finally {
      loading.value = false
    }
  }

  const addBook = async formData => {
    loading.value = true
    error.value = null
    try {
      const res = await api().post('/books/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (res.status === 201 || res.status === 200) {
        books.value.push(res.data)
        snackbar.show('Book added successfully', 'success')
      }
    } catch (err) {
      console.error('Error adding book:', err)
      error.value = err.response?.data?.message || 'Failed to add book'
      snackbar.show(error.value, 'error')
    } finally {
      loading.value = false
    }
  }

  const updateBook = async (bookId, formData) => {
    error.value = null
    try {
      const res = await api().put(`/books/${bookId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.status === 200) {
        const index = books.value.findIndex(book => book.id === bookId)
        if (index !== -1) {
          books.value[index] = res.data
        }
        snackbar.show('Book updated successfully', 'success')
      }
    } catch (err) {
      console.error(`Error updating book with ID ${bookId}:`, err)
      error.value = err.response?.data?.message || 'Failed to update book'
      snackbar.show(error.value, 'error')
    }
  }

  const addTranslation = async ({ bookId, language, name, description }) => {
    try {
      const res = await api().post('/Books/add-translation', {
        bookId,
        language,
        name,
        description,
      })

      if (selectedBook.value) {
        selectedBook.value.translations = {
          ...selectedBook.value.translations,
          [language]: res.data,
        }
      }

      snackbar.show('Translation added successfully', 'success')

      return res.data
    } catch (err) {
      console.error('Error adding translation:', err)
      snackbar.show('Failed to add translation', 'error')
      throw err.response?.data?.message || 'Failed to add translation'
    }
  }

  const editTranslation = async ({ id, language, name, description }) => {
    try {
      const res = await api().put(`/Books/update-translation/${id}`, {
        language,
        name,
        description,
      })

      if (selectedBook.value) {
        selectedBook.value.translations[language] = res.data
      }

      snackbar.show('Translation updated successfully', 'success')

      return res.data
    } catch (err) {
      console.error('Error editing translation:', err)
      snackbar.show('Failed to update translation', 'error')
      throw err.response?.data?.message || 'Failed to update translation'
    }
  }

  const submitTranslation = async ({ language, name, description }) => {
    if (!selectedBook.value) {
      console.error('No selected book to update')
      snackbar.show('No selected book', 'error')

      return
    }

    const arTranslation = selectedBook.value.translations?.ar

    try {
      if (!arTranslation || arTranslation.name === '') {
        await addTranslation({
          bookId: selectedBook.value.id,
          language,
          name,
          description,
        })
      } else {
        await editTranslation({
          id: arTranslation.id,
          language,
          name,
          description,
        })
      }
    } catch (err) {
      console.error('Translation submission failed:', err)
      snackbar.show('Translation submission failed', 'error')
    }
  }

  const deleteBook = async bookId => {
    loading.value = true
    error.value = null

    try {
      const res = await api().delete(`/Books/${bookId}`)
      if (res.status === 200 || res.status === 204) {
        books.value = books.value.filter(book => book.id !== bookId)
        if (selectedBook.value && selectedBook.value.id === bookId) {
          selectedBook.value = null
        }
        snackbar.show('Book deleted successfully', 'success')
      }
    } catch (err) {
      console.error(`Error deleting book with ID ${bookId}:`, err)
      error.value = err.response?.data?.message || 'Failed to delete book'
      snackbar.show(error.value, 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  const editBook = async (bookId, formData) => {
    try {
      const res = await api().put(`/books/${bookId}/pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      snackbar.show('PDF uploaded successfully', 'success')

      return res.data
    } catch (err) {
      console.error('Error uploading PDF:', err)
      snackbar.show('Failed to upload PDF', 'error')
      throw err
    }
  }

  const editBookPicture = async (bookId, formData) => {
    try {
      const res = await api().put(`/books/${bookId}/picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Update selectedBook with the new picture URL (if returned by the backend)
      if (selectedBook.value && res.status === 200) {
        const url = selectedBook.value.picture

        selectedBook.value.picture = url
      }

      snackbar.show('Picture uploaded successfully', 'success')

      return res.data
    } catch (err) {
      console.error('Error uploading picture:', err)
      snackbar.show('Failed to upload picture', 'error')
      throw err
    }
  }

  const totalBooks = computed(() => books.value.length)

  return {
    books,
    selectedBook,
    loading,
    error,
    fetchBooks,
    addBook,
    fetchBookById,
    addTranslation,
    editTranslation,
    submitTranslation,
    deleteBook,
    editBook,
    editBookPicture,
    updateBook,
    totalBooks,
  }
})
