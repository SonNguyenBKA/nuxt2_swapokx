<template>
  <div class="todo-app">
     <h5>Todo App Page</h5>
     <div class="flex flex-col !flex-wrap gap-2 !max-w-[500px] !text-[14px]">
      <div class="flex items-center gap-2">
        <v-text-field
          label="What need to do done ?"
          hide-details="auto"
          v-model="keySearch"
          v-on:keyup="keymonitor"
        ></v-text-field>
        <v-btn class="btn-all"
               :disabled="keySearch.trim() === ''"
               @click="add"
        >Add Todo</v-btn>
      </div>
       <ul>
         <li v-for="(todo, index) in filterTodoList" :key="index" class="flex items-center justify-between p-1">
           <p v-if="isEdit !== todo.id" class="text-[14px]" :class="todo.isComplete ? 'line-through' : ''" @click="toggle(todo)">{{todo.content}}</p>
           <input v-else type="text" class="text-[14px] p-1 rounded-[4px] border border-solid border-[gray]"
                  v-model="content"
                  v-on:keyup="editTodoItem"
                  @focusout="isEdit = -1"
                  ref="refContents"
           >
            <div class="flex items-center gap-2 max-w-fit text-[14px]">
              <button class="text-green-800" @click="editTodo(todo)">Edit</button>
              <button class="text-red-900" @click="deleteTodo(todo)">Delete</button>
            </div>
         </li>
       </ul>
       <div class="filter-option w-full flex justify-center items-center gap-2">
         <button class="btn-all" @click="optionFilter = 'all'">All ({{$store.getters["todo-app/all"].length}})</button>
         <button class="btn-progress" @click="optionFilter = 'progress'">Progress ({{$store.getters["todo-app/progress"].length}})</button>
         <button class="btn-done" @click="optionFilter = 'done'">Done ({{$store.getters["todo-app/done"].length}})</button>
       </div>
     </div>
  </div>
</template>

<script>
export default {
  name: 'TodoAppPage',
  data() {
    return {
      keySearch: '',
      optionFilter: 'all',
      isEdit: -1,
      content: '',
      todo: null
    }
  },
  computed: {
    filterTodoList() {
      return this.$store.getters[`todo-app/${this.optionFilter}`]
    }
  },
  updated() {
    if (this.todo?.id) {
      // const index = this.filterTodoList.findIndex(todo => todo.id === this.todo.id)
      this.$refs.refContents?.[0]?.focus()
    }
  },
  created() {
    this.$store.dispatch('todo-app/getTodoList')
  },
  methods: {
    add() {
      this.$store.dispatch('todo-app/addTodo', {content: this.keySearch, isComplete: false})
      this.keySearch = ''
    },
    keymonitor(event) {
      if (event.key === 'Enter') {
       this.add()
      }
    },
    editTodo(todo) {
      this.isEdit = todo.id
      this.content = todo.content
      this.todo = todo
    },
    toggle(todo) {
      this.$store.dispatch('todo-app/toggleItem', todo)
    },
    deleteTodo(todo) {
      this.$store.dispatch('todo-app/deleteItem', todo)
    },
    editTodoItem(event) {
      if (event.key === 'Enter') {
        this.$store.dispatch('todo-app/editTodoItem', {...this.todo, content: this.content})
        this.isEdit = -1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.todo-app {
  @apply p-4;
  .btn-all, .btn-progress, .btn-done {
    padding: 4px;
    border: 1px solid #4b4b06;
    border-radius: 8px;
  }
}
</style>
