'use client'

import React from 'react'

interface ActionItemProps {
  children: React.ReactNode
}

const ActionItem = ({ children }: ActionItemProps) => {
  // Assuming the AI output for a suggested action is a single list item text.
  // We can wrap it in a div with specific styling to make it look like a card.
  return (
    <div className="action-card">
      {children}
    </div>
  )
}

export default ActionItem
