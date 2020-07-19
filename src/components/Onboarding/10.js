import React from 'react'
import TrainingLayout from './TrainingLayout'
import { FormGroup, RadioButtonGroup, RadioButton } from 'carbon-components-react'

export default () => {
  return (
    <TrainingLayout
      prevPage="/onboarding/09"
      nextPage="/onboarding/11"
      title="Voting Fundamentals"
    >
      <p>True or false:</p>
      <br />
      <p>
        A person who is unable to vote in person on Election Day is not allowed
        to vote in either a Primary or General Election.
      </p>
      <br />
      <FormGroup>
        <RadioButtonGroup
          orientation="vertical"
          labelPosition="right"
          name="radio-button-group"
        >
          <RadioButton
            name="true"
            labelText="True"
            value="standard"
          />
          <RadioButton
            name="false"
            labelText="False"
            value="standard"
          />
        </RadioButtonGroup>
      </FormGroup>
    </TrainingLayout>
  );
}