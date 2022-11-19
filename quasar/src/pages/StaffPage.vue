<template>
  <q-page>
    <div class="row">
      <div class="col">
        <div style="max-width:650px; text-align:center; margin-left:auto; margin-right:auto">
          <q-table
            class="q-ma-md "
            title="To-do List"
            :rows="todoList"
            :columns="todoCols"
            row-key="name"
          > 
            <template #body-cell-status="props">
              <q-td :props="props">
                <q-badge :color="this.statusColor(props.row)">
                  {{props.row.status}}
                </q-badge>
              </q-td>
            </template>
            <template #body-cell-action="props">
              <q-td :props="props">
                <div class="q-pa-sm">
                  <q-btn class="q-pa-xs" color="primary" label="Completed!" @click="onClick(props.row)" />
                </div>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { userStore } from "../stores/user-store"

export default defineComponent({
  name: 'StaffPage',
  data() {
    return {
      store: userStore(),
      todoList: [],
      todoCols: [
        { name: 'id', label: 'Request ID', field: 'id', align: 'left'},
        { name: 'date', label: 'Date', field: 'date', align: 'left', },
        { name: 'address', label: 'Address', field: 'address', align: 'left', },
        { name: 'email', label: 'Email', field: 'email', align: 'left', },
        { name: 'status', label: 'Status', field: 'status', align: 'left', },
        { name: 'staffId', label: 'Staff ID', field: 'staffId', align: 'left' },
        { name: 'action', label: 'Action', field: 'action', align: 'left' }
      ],
    }
  },
  methods: {
    statusColor(status) {
      for(let i = 0; i < this.histories.length; i++) {
        if (status == 'Pending') {
          return 'grey-8'
        }
        else if (status == 'In-progress') {
          return 'green-8'
        }
        else if (status == 'Rejected') {
          return 'red-8'
        }
        else if (status == 'Completed') {
          return 'blue-8'
        }
      }
    },
    onClick(item) {
      const index = this.store.todoList.indexOf(item)
      if(this.store.todoList[index].status == 'In-progress') {
        this.store.todoList[index].status = 'Completed'
        for(let i = 0; i < this.store.requestList.length; i++) {
          if(this.store.todoList[index].requestId == this.store.requestList[i].requestId) {
            this.store.requestList[i].status = "Completed"
            this.store.disableCheck[i] = true
          }
        }
      }
    }
  }
})
</script>