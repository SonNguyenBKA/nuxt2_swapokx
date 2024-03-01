export const state = () => ({
  todoList: []
})
export const getters = {
  all(state) {
    return state.todoList
  },
  progress(state) {
    return state.todoList.filter(todo => !todo.isComplete)
  },
  done(state) {
    return state.todoList.filter(todo => todo.isComplete)
  }
}
export const mutations = {
  store(state, payload) {
    state.todoList = payload
  },
  add(state, payload) {
    state.todoList.push(payload)
  },
  edit(state, payload) {
    const index = state.todoList.findIndex(todo => todo.id === payload.id)
    state.todoList[index].content = payload.content
  },
  toggle(state, payload) {
    const index = state.todoList.findIndex(todo => todo.id === payload.id)
    state.todoList[index].isComplete = payload.isComplete
  },
  delete(state, payload) {
    const index = state.todoList.findIndex(todo => todo.id === payload.id)
    state.todoList.splice(index, 1)
  }
}
export const actions = {
  getTodoList({commit}) {
    return this.$axios.get('http://localhost:3001/todo-list').then(res => {
      console.log(res)
      commit('store', res.data)
    })
  },
  addTodo({commit}, body) {
    return this.$axios.post('http://localhost:3001/todo-list', body).then(res => {
      console.log(res)
      if (res && res.status === 201) {
        commit('add', res.data)
      } else {
        alert('add todo item error')
      }
    })
      .catch((e) => {
        alert(e)
      })
  },
  editTodoItem({commit}, body) {
    console.log(body)
    return this.$axios.put(`http://localhost:3001/todo-list/${body.id}`, {...body,content: body.content}).then(res => {
      if (res && res.status === 200) {
        commit('edit', res.data)
      }
    })
  },
  toggleItem({commit}, body) {
    return this.$axios.put(`http://localhost:3001/todo-list/${body.id}`, {...body,isComplete: !body.isComplete}).then(res => {
      if (res && res.status === 200) {
        commit('toggle', res.data)
      }
    })
  },
  deleteItem({commit}, body) {
    return this.$axios.delete(`http://localhost:3001/todo-list/${body.id}`, body).then(res => {
      if (res && res.status === 200) {
        commit('delete', res.data)
      }
    })
  }
}
