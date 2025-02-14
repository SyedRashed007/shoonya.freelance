import { gql, useMutation, useQuery } from '@apollo/client'
import Button from '@material-ui/core/Button'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import EditIcon from '@material-ui/icons/Edit'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'

interface UserObj {
  name: string
  title: string
}

const GET_USER = gql`
  query User($_id: ID!) {
    user(_id: $_id) {
      name
      title
    }
  }
`
const UPDATE_USER = gql`
  mutation UpdateUserNameTitle($_id: ID!, $name: String, $title: String) {
    updateUserNameTitle(_id: $_id, name: $name, title: $title) {
      name
      title
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

function UserNameTitle({ isReadOnly, userId }) {
  const [edit, setEdit] = useState<boolean>(false)
  const classes = useStyles()
  const { loading, data } = useQuery(GET_USER, {
    variables: { _id: userId },
  })
  const [updateUserNameTitle, { error }] = useMutation(UPDATE_USER)

  const initialVal = {
    name: '',
    title: '',
  }

  const [nameTitle, setNameTitle] = useState<UserObj>(initialVal)

  useEffect(() => {
    if (data?.user?.name) {
      setNameTitle({
        name: data.user.name,
        title: data.user.title,
      })
      setEdit(false)
    } else setEdit(true)
  }, [data])

  if (loading) return <div>Loading...</div>

  if (error) return <div>Error! ${error.message}</div>

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setNameTitle({
      ...nameTitle,
      [evt.target.name]: evt.target.value,
    })
  }

  const updateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await updateUserNameTitle({
      variables: { _id: userId, name: nameTitle.name, title: nameTitle.title },
      refetchQueries: [{ query: GET_USER, variables: { _id: userId } }],
    })
    setEdit(!edit)
  }

  const cancelUpdateUser = () => {
    if (data) {
      setNameTitle({
        name: data.name,
        title: data.title,
      })
    } else setNameTitle(initialVal)
    setEdit(false)
  }

  return (
    <div className="bg-resume flex flex-col justify-center p-4 md:p-6">
      <h3 className="text-xl md:text-2xl  uppercase pb-3">name</h3>
      {edit && isReadOnly ? (
        <form className="flex flex-col" onSubmit={updateUser}>
          <div className="flex flex-col whitespace-nowrap">
            <div className="flex justify-between">
              <h1 className="text-black text-5xl">{data.name}</h1>
              <button type="button" onClick={() => setEdit(!edit)}>
                <EditIcon />
              </button>
            </div>
            <h3>{data.title} </h3>
          </div>
          <TextField
            name="name"
            label="Name"
            onChange={handleChange}
            value={nameTitle.name}
            color="primary"
            margin="dense"
            variant="outlined"
            required
          />
          <TextField
            name="title"
            label="Title"
            onChange={handleChange}
            value={nameTitle.title}
            color="primary"
            margin="dense"
            variant="outlined"
          />
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
          <TextField onChange={handleChange} value={nameTitle.name} color="primary" margin="dense" variant="outlined" />
          <TextField
            onChange={handleChange}
            value={nameTitle.title}
            color="primary"
            margin="dense"
            variant="outlined"
          />
        </>
      )}
    </div>
  )
}

export default UserNameTitle
