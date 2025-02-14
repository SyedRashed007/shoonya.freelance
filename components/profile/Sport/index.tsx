/* eslint-disable react/no-array-index-key */
import { gql, useMutation, useQuery } from '@apollo/client'
import { TextField } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'

import DeleteAlert from '../DeleteAlert'
import TextFieldAndDeleteBtn from '../TextFieldAndDeleteBtn'

const GET_USER = gql`
  query User($_id: ID!) {
    user(_id: $_id) {
      sports
    }
  }
`
const UPDATE_USER = gql`
  mutation UpdateUserSports($_id: ID!, $sports: [String]) {
    updateUserSports(_id: $_id, sports: $sports) {
      sports
    }
  }
`
const useStyles = makeStyles(() =>
  createStyles({
    btn: {
      alignSelf: 'flex-end',
      borderRadius: '999px',
    },
    savecancelbtn: {
      marginRight: '.5rem',
    },
  })
)

const Sport = ({ isReadOnly, userId }) => {
  const [edit, setEdit] = useState<boolean>(false)
  const [popUp, setPopup] = useState({ show: false, index: null })
  const classes = useStyles()
  const { loading, data } = useQuery(GET_USER, {
    variables: { _id: userId },
  })
  const [updateUserSports, { error }] = useMutation(UPDATE_USER)

  const [sports, setSports] = useState<String[]>([])

  useEffect(() => {
    if (data?.user?.sports) {
      setSports(data.user.sports)
      setEdit(false)
    } else setEdit(true)
  }, [data])

  if (loading) return <div>Loading...</div>

  if (error) return <div>Error! ${error.message}</div>

  const handleChange = (index: number) => (evt: ChangeEvent<HTMLInputElement>) => {
    setSports([...sports.slice(0, index), evt.target.value, ...sports.slice(index + 1)])
  }

  const updateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await updateUserSports({
      variables: { _id: userId, sports },
      refetchQueries: [{ query: GET_USER, variables: { _id: userId } }],
    })
    setEdit(!edit)
  }

  const cancelUpdateUser = () => {
    if (data?.user?.sports) {
      setSports(data.user.sports)
    } else setSports([])
    setEdit(false)
  }

  const addSport = () => {
    setSports([...sports, ''])
  }

  const openPopup = (i) => {
    setPopup({ show: true, index: i })
  }
  const closePopUp = () => {
    setPopup({ show: false, index: null })
  }

  const handleDelete = async () => {
    const filterDeletedItem = sports.filter((_, index) => index !== popUp.index)
    await updateUserSports({
      variables: { _id: userId, sports: filterDeletedItem },
      refetchQueries: [{ query: GET_USER, variables: { _id: userId } }],
    })
    closePopUp()
  }

  return (
    <div className="bg-resume flex flex-col justify-center p-4 md:p-6">
      <div className="flex justify-between pb-3">
        <h3 className="text-xl md:text-2xl uppercase">Sports</h3>
      </div>
      {edit && isReadOnly ? (
        <form className="flex flex-col" onSubmit={updateUser}>
          <div className="flex justify-end">
            <button type="button" onClick={() => setEdit(!edit)}>
              <EditIcon />
            </button>
          </div>
          {sports.map((sport, i): any => (
            <TextFieldAndDeleteBtn
              key={i}
              handleChange={handleChange}
              index={i}
              label="language"
              value={sport}
              openPopup={openPopup}
            />
          ))}
          {popUp.show ? <DeleteAlert closePopUp={closePopUp} handleDelete={handleDelete} /> : null}
          <Button className={classes.btn} onClick={() => addSport()}>
            Add Sport
          </Button>

          <div className="pt-1 self-end">
            <Button className={classes.savecancelbtn} type="submit" variant="contained" color="primary">
              Save
            </Button>
            <Button
              className={classes.savecancelbtn}
              onClick={() => cancelUpdateUser()}
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <>
          {sports.map((sport, i): any => (
            <TextField
              onChange={handleChange}
              index={i}
              value={sport}
              openPopup={openPopup}
              size="small"
              color="primary"
              margin="dense"
              variant="outlined"
            />
          ))}
        </>
      )}
    </div>
  )
}

export default Sport
