/**
 * get workspace users
 */
export const getStateWorkspaceUsers = async () :Promise<IBrUser[]|void>=> {
  // let users = null
  //   const { data, error } = await useFetch('/api/workspaceusers', {
  //     method: 'GET'
  //   })
  //   if(data.value) { 
  //     users = data.value
  //     const stateUsers = useWorkspaceUsers().value
  //     useWorkspaceUsers().value = users
  //   }
  //   if(error.value) errorToSnack("Error in get users", error.value)
  //   return users
    $fetch<IBrUser[]>('/api/workspaceusers', {
      method: 'GET'
    })
    .then((list) => {
        useWorkspaceUsers().value = list
        return list
    })
    .catch((error) => {
      errorToSnack("Error in get users", error)
    })
}
