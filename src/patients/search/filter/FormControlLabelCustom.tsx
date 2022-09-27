
 import { Checkbox, FormControlLabel, styled, ThemeProvider } from '@mui/material';
import React from 'react';
import theme from './theme';

 
 interface CheckBoxProps {
   label: string | undefined;
   onLabelChange?: (event: React.ChangeEvent<HTMLInputElement>, labelChecked: boolean) => void;
   labelChecked?: boolean;
   disabled?: boolean;
   name?: string;
 }
 
 const StyledFormControlLabel = styled(FormControlLabel)(() => ({
   '& .MuiFormControlLabel-label': {
     fontWeight: '500',
     
   },
 }));
 
 const StyledCheckbox = styled(Checkbox)({
   '&:hover': {
     backgroundColor: 'transparent',
   },
   '& .MuiSvgIcon-root': {
     width: '1rem',
     height: '1rem',
     borderRadius: '0.3rem',
   },
 });
 
 const CheckBoxComponent = (props: CheckBoxProps) => {
   const { label, onLabelChange, disabled, labelChecked, name } = props;
 
   return (
    <ThemeProvider theme={theme}>
     <StyledFormControlLabel
       control={
         <StyledCheckbox  
          color='primary'        
           onChange={onLabelChange}
           value={label}
           name={name}
           checked={labelChecked}
           disabled={disabled}
           {...props}
         />
       }
       label={label}
     />
     </ThemeProvider>
   );
 };
 
 export default CheckBoxComponent;
 