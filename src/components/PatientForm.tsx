
import React from 'react';
import { TextInput, Button } from '@hospitalrun/components';

interface Props {
  isEditable?: boolean,
  patient?: { firstName: string, lastName: string }
  onFieldChange: (key: string, value: string) => void,
  onSaveButtonClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onCancelButtonClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const PatientForm: React.FC<Props> = (props: Props) => {
  const handleChange = (event: any, fieldName: string) => {
    const htmlInputEvent = event as React.FormEvent<HTMLInputElement>
    props.onFieldChange(fieldName, htmlInputEvent.currentTarget.value)
  }

  let firstName = '';
  let lastName = '';
  if(props.patient) {
    firstName = props.patient.firstName;
    lastName = props.patient.lastName;
  }

  return (
    <div>
      <form>
        <div className="row">
          <h3>First Name:</h3>
          <TextInput value={firstName} disabled={!props.isEditable} onChange={(event) => handleChange(event, 'firstName')} />
        </div>
        <div className="row">
          <h3>Last Name:</h3>
          <TextInput value={lastName} disabled={!props.isEditable} onChange={(event) => handleChange(event, 'lastName')} />
        </div>
        {props.isEditable &&
          <div className="row">
            <Button onClick={props.onSaveButtonClick}>Save</Button>
            <Button color="danger" onClick={props.onCancelButtonClick} >Cancel</Button>
          </div>
        }
      </form>
    </div>
  );
}

PatientForm.defaultProps = {
  isEditable: true,
  patient: {firstName: '', lastName: ''},
}

export default PatientForm;
