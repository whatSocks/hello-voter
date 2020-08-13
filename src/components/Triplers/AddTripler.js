import React, {useEffect, useState} from 'react'
import { Search, Button } from 'carbon-components-react'
import styled from 'styled-components'
import { spacing, breakpoints } from '../../theme'
import PageLayout from '../PageLayout'
import Breadcrumbs from '../Breadcrumbs'
import DataTable from '../DataTable'
import { AppContext } from '../../api/AppContext'
import { useHistory } from 'react-router-dom'
import Loading from '../Loading'

export default () => {
  const history = useHistory()
  const [triplers, setTriplers] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { api } = React.useContext(AppContext)

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.fetchFreeTriplers()
      const triplersWithAddress = data.data.map((p) => ({
        id: p.id,
        name: p.first_name + ' ' + p.last_name,
        address: p.address.address1 + ' ' + p.address.city + ' ' + p.address.state
      }))
      setTriplers(triplersWithAddress)
    }
    fetchData()
  }, [])

  const claimTriplers = (selectedTriplers) => async () => {
    if (selectedTriplers.length > 12) return alert('You can select max 12 triplers.')
    setIsLoading(true)
    await api.claimTriplers(selectedTriplers.map((c) => c.id))
    setIsLoading(false)
    history.push('/triplers')
  }

  return (
    triplers ? <AddTriplersPage triplers={triplers} claimTriplers={claimTriplers} loading={isLoading} /> : <Loading />
  )
}

const SearchBarContainer = styled(Form)`
  display: grid;
  grid-auto-columns: 1fr;
  grid-column-gap: ${ spacing[5]};
  grid-row-gap: ${ spacing[5]};
  grid-template-columns: repeat(12, 1fr);
  margin-top: ${ spacing[5]};
  @media (max-width: ${breakpoints.md.width}) {
    grid-column-gap: ${ spacing[3]};
    grid-row-gap: ${ spacing[3]};
  }
`

const SearchFieldStyled = styled(Search)`
  grid-column-end: span 5;
  @media (max-width: ${breakpoints.md.width}) {
    grid-column-end: span 6;
  }
`

const SearchButtonStyled = styled(Button)`
  width: 100%;
  max-width: 100%;
  grid-column-end: span 2;
  @media (max-width: ${breakpoints.md.width}) {
    grid-column-end: span 12;
  }
`

const AddTriplersPage = ({ triplers, claimTriplers }) => {
  return (
    <PageLayout
      title="Add Vote Triplers"
      header={<Breadcrumbs items={
        [
          {
            name: "Home",
            route: "/home"
          },
          {
            name: "Vote Triplers",
            route: "/triplers"
          },
          {
            name: "Add"
          }
        ]
      }/>}
    >
      <p>Check the folks you know!</p>
      <SearchBarContainer onSubmit={(e) => ([])}>
        <SearchFieldStyled
          name="" 
          placeHolderText="First Name"
          size="lg"
          onChange={() => ([])}
        />
        <SearchFieldStyled
          name="" 
          placeHolderText="Last Name"
          size="lg"
          onChange={() => ([])}
        />
        <SearchButtonStyled size="field" kind="tertiary" type="submit">
          Search
        </SearchButtonStyled>
      </SearchBarContainer>
      <DataTable
        headers={[
          {
            header: 'Eligible people',
            key: 'name'
          },
          {
            header: '',
            key: 'address'
          },
        ]}
        rows={triplers}
        handleSelected={claimTriplers}
      />
    </PageLayout>
  )
}
