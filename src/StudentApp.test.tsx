import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import StudentApp from './StudentApp'

describe('StudentApp', () => {
  beforeEach(() => {
    // isolate autosave between tests
    localStorage.clear()
  })

  it('renders header and navigation', () => {
    render(<StudentApp />)
    expect(screen.getByText('MISY261: Business Information Systems')).toBeInTheDocument()
    // first tab button should be Title now
    expect(screen.getByRole('button', { name: /1\. Title/ })).toBeInTheDocument()
  })

  it('shows Title content by default', () => {
    render(<StudentApp />)
    expect(screen.getByText('MISY261: Business Information Systems')).toBeInTheDocument()
    expect(screen.getByText('Homework 1: Data Management and Data Modeling')).toBeInTheDocument()
  })
})
