import React, { useState, useEffect } from 'react'
import {Form, FormGroup, TextInput, Link, Row} from 'carbon-components-react'
import PageLayout from '../PageLayout'
import Breadcrumbs from '../Breadcrumbs'
import Button from '../Button'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../api/AppContext'
import Loading from '../Loading'
import { useHistory } from 'react-router-dom'
import { InlineNotification } from 'carbon-components-react'

export default () => {
  const [tripler, setTripler] = useState(null)
  const [loading, setLoading] = useState(false)
  let { triplerId } = useParams()
  const { api } = React.useContext(AppContext)
  useEffect(() => {
    const fetchData = async () => {
      const data = await api.fetchTripler(triplerId)
      setTripler(data.data)
    }
    fetchData()
  }, [])

  const confirmTriplers = async (triplerId, formData) => {
    setLoading(true)
    const { error, data } = await api.confirmTriplers(triplerId, formData)
    setLoading(false)
    return {
      error,
      data
    }
  }

  return tripler ? <ConfirmPage tripler={tripler} confirmTriplers={confirmTriplers} loading={loading}/> : <Loading />
}

const ConfirmPage = ({ tripler, confirmTriplers, loading }) => {
  const history = useHistory()
  const [err, setErr] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const { error } = await confirmTriplers(tripler.id, {
      phone: formData.get('phone'),
      triplees: [formData.get('triplee1'), formData.get('triplee2'), formData.get('triplee3')],
      address: tripler.address
    })
    if (error) return setErr(error.msg)
    history.push('/triplers')
  }
  return (
    <PageLayout
      title={`Tripler: ${tripler.first_name}`}
      onClickSubmit={submit}
      header={
        <Breadcrumbs
          items={[
            {
              name: "Home",
              route: "/",
            },
            {
              name: "Triplers",
              route: "/",
            },
            {
              name: "Confirm",
              route: "/",
            },
          ]}
        />
      }
    >
      <p>Add the names of three Voters the Vote Tripler will remind to vote:</p>
      <FormGroup>
        <TextInput
          name="triplee1"
          invalidText="Invalid error message."
          labelText="Name 1"
          placeholder="Name"
          required
        />
      </FormGroup>
      <FormGroup>
        <TextInput
          name="triplee2"
          invalidText="Invalid error message."
          labelText="Name 2"
          placeholder="Name"
          required
        />
      </FormGroup>
      <FormGroup>
        <TextInput
          name="triplee3"
          invalidText="Invalid error message."
          labelText="Name 3"
          placeholder="Name"
          required
        />
      </FormGroup>
      <p>Add the Vote Tripler's phone number so we can confirm his or her identity and send you your payment!</p>
      <FormGroup>
        <TextInput
          name="phone"
          invalidText="Invalid error message."
          labelText="Melody’s Phone Number"
          placeholder="123-456-7890"
          required
        />
      </FormGroup>
      {err &&
      <InlineNotification
        kind="error"
        icondescription="Dismiss notification"
        subtitle={err}
        title="Oops!"
      />
      }
      <Button type="submit" loading={loading}>Add</Button>
      <Button small kind="tertiary" href={'/triplers'}>Go back to My Vote Triplers</Button>
    </PageLayout>
  )
}
