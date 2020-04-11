import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'

import { AsyncTypeahead } from 'react-bootstrap-typeahead'

interface Props {
  id: string
  searchAccessor: string
  renderMenuItemChildren: (option: any) => React.ReactNode
  onChange: (selected: any) => void
  onSearch: (query: string) => Promise<any[]>
  minLength?: number
  placeholder?: string
  value?: any
  disabled?: boolean
  feedback?: string
  setErrorMessageState?: (arg0: { [key: string]: string } | any) => void
}

const TypeaheadWithFeebBack = (props: Props) => {
  const [options, setOptions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {
    id,
    searchAccessor,
    placeholder,
    onSearch,
    onChange,
    renderMenuItemChildren,
    minLength,
    value,
    disabled,
    feedback,
  } = props

  const search = async (query: string) => {
    setIsLoading(true)
    const results = await onSearch(query)
    setOptions(results)
    setIsLoading(false)
  }

  const selectedValues = []
  if (value) {
    selectedValues.push(value)
  }

  return (
    <Form.Group>
      <AsyncTypeahead
        id={id}
        labelKey={searchAccessor}
        options={options}
        placeholder={placeholder}
        isLoading={isLoading}
        minLength={minLength}
        onSearch={search}
        onChange={onChange}
        renderMenuItemChildren={renderMenuItemChildren}
        defaultSelected={selectedValues}
        disabled={disabled}
        isInvalid={!!feedback}
      />
      {feedback && <span className="text-danger small">{feedback}</span>}
    </Form.Group>
  )
}

TypeaheadWithFeebBack.defaultProps = {
  minLength: 3,
}

export default TypeaheadWithFeebBack
