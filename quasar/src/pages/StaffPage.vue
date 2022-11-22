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
                <q-badge :color="this.statusColor(props.row.status)">
                  {{props.row.status}}
                </q-badge>
              </q-td>
            </template>
            <template #body-cell-action="props">
              <q-td :props="props">
                <div class="q-pa-sm">
                  <q-btn class="q-pa-xs" color="primary" label="Completed!" @click="onClick(props.row)" :disabled="disable[todoList.indexOf(props.row)] ? '' : disabled"/>
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
import { Notify } from "quasar"

export default defineComponent({
  name: 'StaffPage',
  data() {
    return {
      store: userStore(),
      todoList: [],
      todoCols: [
        { name: 'id', label: 'Request ID', field: 'id', align: 'left'},
        { name: 'request_date', label: 'Date', field: 'request_date', align: 'left', },
        { name: 'address', label: 'Address', field: 'address', align: 'left', },
        { name: 'email', label: 'Email', field: 'email', align: 'left', },
        { name: 'status', label: 'Status', field: 'status', align: 'left', },
        { name: 'staff_id', label: 'Staff ID', field: 'staff_id', align: 'left' },
        { name: 'action', label: 'Action', field: 'action', align: 'left' }
      ],
      disable: []
    }
  },
  methods: {
    getAllToDos() {
      this.$api.get('/requests/transaction/todo')
      .then((res) => {
        if (res.status == 200) {
          console.log(res.data);
          this.todoList = res.data
          for(let i = 0;i<this.todoList.length; i++) {
            if(this.todoList[i].status == "Completed") {
              this.disable[i] = true
            }
          }
        }
      })
      .catch((err) => {
        Notify.create({
          type: "negative",
          message: "Unauthorized"
        })
      })
    },
    statusColor(status) {
      for(let i = 0; i < this.todoList.length; i++) {
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
      const index = this.todoList.indexOf(item)

      const data = {
        status: "Completed",
        staff_id: this.todoList[index].staff_id
      }
      console.log(data)
      this.$api.put("/requests/" + item.id, data)
      .then((res) => {
        if(res.status == 200) {
          Notify.create({
            type: "positive",
            message: "Comleted request ID: " + res.data.id
          })
          this.getAllToDos();
        }
      })
      .catch((err)=>{
        console.log(err)
      })

      const data2 = {
        staff_status: false
      }
      console.log(data)
      this.$api.put("/staffs/staff/" + this.todoList[index].staff_id, data2)
      .then((res) => {
        if(res.status == 200) {
          Notify.create({
            type: "positive",
            message: "Completed status ID: " + res.data.id
          })
          this.getAllToDos();
        }
      })
      .catch((err)=>{
        console.log(err)
      })

      // const data2 = {
      //   name: this.todoList[index].name,
      //   staff_status: false
      // }
      // this.$api.put("/staffs/" + this.todoList[index].staffID, data2)
      // .then((res) => {
      //   if(res.status == 200) {
      //     Notify.create({
      //       type: "positive",
      //       message: "staff rejected ID: " + this.todoList[index].staffID
      //     })
      //     this.getSelectedStaffs();
      //   }
      // })
      // .catch((err)=>{
      //   console.log(err)
      // })
      // const index = this.requests.indexOf(request)
      // const data2 = {
      //   name: this.requests[index].name,
      //   staff_status: false
      // }
      // this.$api.put("/staffs/" + this.requests[index].staffID, data2)
      // .then((res) => {
      //   if(res.status == 200) {
      //     Notify.create({
      //       type: "positive",
      //       message: "staff rejected ID: " + this.requests[index].staffID
      //     })
      //     this.getSelectedStaffs();
      //   }
      // })
      // .catch((err)=>{
      //   console.log(err)
      // })
    }
  },
  async mounted() {
    await this.getAllToDos();
  }
})
</script>