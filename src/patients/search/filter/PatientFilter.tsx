import { Dialog, Grid, Paper, Typography, styled, IconButton } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Button } from '@hospitalrun/components'
import CheckBoxComponent from './FormControlLabelCustom'
import { LabelsContext } from '../SearchPatients'

interface FilterMenuProps {
  data: Data[]
  filterMenuState: boolean
  handleClose: () => void
  handleFilters: (param: any) => void
  handleApply: () => void
  clearFilters: (param: boolean) => void
  trigger: boolean
}

interface Data {
  id: string
  name: string
  inputs: string[]
}

const ButtonGrid = styled(Grid)({
  paddingRight: '16px',
})

const MenuContainer = styled(Grid)({
  display: 'flex',
  justifyContent: 'end',
  paddingTop: '39px',
})

const MainContainer = styled(Grid)({
  maxWidth: '546px',
  maxHeight: '464px',
})

const CloseIconContainer = styled(Grid)({
  justifyContent: 'end',
})

const StyledPaper = styled(Paper)({
  paddingRight: '25px',
  paddingLeft: '50px',
  paddingTop: '31px',
  paddingBottom: '32px',
})

const CloseButton = styled(IconButton)({
  marginTop: '-24px',
  marginRight: '-17px',
})

const renderCheckbox = (
  index: number,
  checkboxInputs: string[],
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  checked: Object,
) => {
  let checkedArray = Object.values(checked)
  let checkedKeys = Object.keys(checked)
  index--
  return checkboxInputs.map((input) => {
    index++
    return (
      <Grid item>
        <CheckBoxComponent
          label={input}
          labelChecked={checkedArray[index]}
          name={checkedKeys[index]}
          onLabelChange={handleChange}
          aria-hidden="true"
        />
      </Grid>
    )
  })
}

const renderCheckboxSecond = (
  index: number,
  checkboxInputs: string[],
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  checked: Object,
) => {
  let checkedArray = Object.values(checked)
  let checkedKeys = Object.keys(checked)
  index--
  return checkboxInputs.map((input) => {
    index++
    return (
      <Grid item xs={4}>
        <CheckBoxComponent
          label={input}
          labelChecked={checkedArray[index]}
          name={checkedKeys[index]}
          onLabelChange={handleChange}
          aria-hidden="true"
        />
      </Grid>
    )
  })
}

const renderSet = (
  data: Data[],
  checked: Object,
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
) => {
  let index = -4
  return data.map((entry) => {
    index += entry.inputs.length
    return (
      <Grid item xs={5}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5" children={entry.name} />
          </Grid>

          <Grid item>
            {entry.name === 'Blood Group'
              ? renderCheckboxSecond(index, entry.inputs, handleChange, checked)
              : renderCheckbox(index, entry.inputs, handleChange, checked)}
          </Grid>
        </Grid>
      </Grid>
    )
  })
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  filterMenuState,
  handleClose,
  data,
  handleFilters,
  handleApply,
  clearFilters,
  trigger,
}) => {
  const [checked, setChecked] = useState({
    gMale: false,
    gFemale: false,
    gOther: false,
    gUnknown: false,
    ageZeroTwenty: false,
    ageTwentyForty: false,
    ageFortySixty: false,
    ageSixtyPlus: false,
  })
  const [filters, setFilters] = useState<Array<string>>([])
  let filterContext = useContext(LabelsContext)

  useEffect(() => {}, [filters])

  useEffect(() => {
    if(trigger){
      clearAll()
    }
  }, [trigger])

  const clearAll = () => {
    filters.splice(0, filters.length)
    setChecked({
      gMale: false,
      gFemale: false,
      gOther: false,
      gUnknown: false,
      ageZeroTwenty: false,
      ageTwentyForty: false,
      ageFortySixty: false,
      ageSixtyPlus: false,
    })
    setFilters([...filters])
    clearFilters(true)
  }

  const applyFilter = () => {
    filterContext.setFilterLabels([...filters])
    handleFilters(filters)
    handleApply()
    clearFilters(false)
    handleClose()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!filters.includes(event.target.value)) {
      filters.push(event.target.value)
    }
    console.log('event: ', event.target.value)
    setFilters([...filters])
    setChecked({
      ...checked,
      [event.target.name]: event.target.checked,
    })
    console.log('filters: ', filters)
  }

  return (
    <Dialog
      open={filterMenuState}
      onClose={handleClose}
      PaperComponent={StyledPaper}
      aria-hidden="true"
    >
      <CloseIconContainer container>
        <CloseButton aria-label="delete" onClick={handleClose}>
          <CloseIcon />
        </CloseButton>
      </CloseIconContainer>
      <MainContainer container rowSpacing={5} columnSpacing={6}>
        {renderSet(data, checked, handleChange)}
      </MainContainer>
      <MenuContainer container direction="row">
        <ButtonGrid item>
          <Button
            style={{ width: '10rem', height: '2.97rem' }}
            outlined
            color="success"
            onClick={clearAll}
          >
            Clear All
          </Button>
        </ButtonGrid>
        <Grid item>
          <Button
            style={{ width: '10rem', height: '2.97rem' }}
            color="primary"
            onClick={applyFilter}
          >
            Apply
          </Button>
        </Grid>
      </MenuContainer>
    </Dialog>
  )
}
export default FilterMenu
