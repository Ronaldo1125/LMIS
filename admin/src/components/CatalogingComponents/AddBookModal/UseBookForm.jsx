import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const initialFormState = {
  category: '',
  callNumber: '',
  title: '',
  author: '',
  editor: '',
  edition: '',
  publication: '',
  publisher: '',
  dateOfPublication: '',
  extent: '',
  dimensions: '',
  otherPhysicalDetails: '',
  accompanyingMaterial: '',
  isbn: '',
  issn: '',
  notesArea: '',
  subjects: '',
  copies: 1
}

export const useBookForm = (isOpen) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(initialFormState)

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get(`${API_URL}/books/meta/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCategories(response.data)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('Failed to load categories')
    }
  }

  const resetForm = () => {
    setFormData(initialFormState)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('authToken')
      
      const bookData = {
        category: formData.category,
        call_number: formData.callNumber,
        title: formData.title,
        author: formData.author,
        editor: formData.editor,
        edition: formData.edition,
        publication: formData.publication,
        publisher: formData.publisher,
        date_of_publication: formData.dateOfPublication || null,
        extent: formData.extent,
        dimensions: formData.dimensions,
        other_physical_details: formData.otherPhysicalDetails,
        accompanying_material: formData.accompanyingMaterial,
        isbn: formData.isbn,
        issn: formData.issn,
        notes_area: formData.notesArea,
        subjects: formData.subjects,
        copies: parseInt(formData.copies)
      }

      const response = await axios.post(`${API_URL}/books`, bookData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // Return the bookId from the response for file uploads
      const bookId = response.data.bookId
      
      resetForm()
      
      // Return bookId so AddBookModal can use it for file uploads
      return bookId

    } catch (err) {
      console.error('Error adding book:', err)
      setError(
        err.response?.data?.message || 
        'Failed to add book. Please try again.'
      )
      return null // Return null on error
    } finally {
      setLoading(false)
    }
  }

  return {
    categories,
    loading,
    error,
    formData,
    setFormData,
    handleSubmit,
    resetForm
  }
}