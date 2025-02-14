import { gql, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'

import MasterDetailsLayout from '../../components/common/MasterDetailsLayout'
import ProjectList from '../../components/projects/ProjectList'

const GET_PROJECTS = gql`
  query Projects {
    projects {
      name
      description
      __typename
      priceRange
      id
    }
  }
`

export default function Projects() {
  const { error, loading, data } = useQuery(GET_PROJECTS)
  const [id, setId] = useState<any>(null)
  useEffect(() => {
    if (data) setId(data.projects[0].id)
  }, [data])
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error! {error.message}</div>

  const setActiveId = (newId) => {
    setId(newId)
  }
  return (
    <div style={{ marginLeft: '57px' }}>
      <MasterDetailsLayout>
        <ProjectList setActiveId={setActiveId} data={data.projects} />
        <div className="border-l-2 border-solid border-primary">{id}</div>
      </MasterDetailsLayout>
    </div>
  )
}
