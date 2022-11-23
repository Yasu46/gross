<template>
  <q-page>
    <div class="row q-mt-lg q-mx-sm">
      <div class="col">
        <div style="max-width:650px; text-align:center; margin-left:auto; margin-right:auto">
          <q-table
            title="Manage Request"
            :rows="requests"
            :columns="reqCols"
            row-key="name"
          >
            <template #body-cell-status="props">
              <q-td :props="props">
                <q-badge :color="this.statusColor(props.row.status)">
                  {{props.row.status}}
                </q-badge>
              </q-td>
            </template>
            <!-- <q-btn-dropdown
              key="defaultLabel" 
              :props="props"
              color="primary" 
              :label="defaultLabel"
              lazy-rules
              :rules="[rule]"
              aria-errormessage="errormessage"
            >
              <q-list>
                <q-item 
                  v-for="(category, index) in renewCategory"
                  :key="index"
                  clickable v-close-popup 
                  @click="defaultLabel= category.name"
                >
                  <q-item-section>
                    <q-item-label>{{ category.name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown> -->
            <template #body-cell-action="props">
              <q-td :props="props">
                <div class="q-pa-md">
                  <q-btn-dropdown
                    dense
                    :value="props.row.staffID"
                    :label="props.row.staffNameLabel"
                    icon="engineering" 
                    color="primary"
                    :disabled="assignedCheck[requests.indexOf(props.row)] ? '' : disabled"
                  >
                    <q-list>
                      <q-item 
                        clickable 
                        v-close-popup
                        @click="props.row.staffNameLabel = staff.name, props.row.staffID = staff.id"
                        v-for="(staff,index) in staffs"
                        :key="index"
                      >
                        <q-item-section>
                          <q-item-label>{{staff.id}}: {{staff.name}}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                  <q-btn
                    dense
                    :color="assignedCheck[requests.indexOf(props.row)] ? 'green-8' : 'grey-8'"
                    :icon="assignedCheck[requests.indexOf(props.row)] ? 'check' : 'unchecked'"
                    @click="onAssigned(props.row)"
                    :disabled="assignedCheck[requests.indexOf(props.row)] ? '' : disabled"
                  />
                  <q-btn
                    class="q-mx-sm"
                    dense
                    color="red" 
                    icon="not_interested" 
                    @click="onReject(props.row)"
                    :disabled="disableCheck[requests.indexOf(props.row)] ? '' : disabled"
                  />
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
import { Notify } from "quasar"
import { userStore } from "../stores/user-store"

export default defineComponent({
  name: 'TransactionPage',
  data() {
    return {
      store: userStore(),
      requests: [],
      reqCols: [
        { name: 'id', label: 'Request ID', field: 'id', align: 'left'},
        { name: 'request_date', label: 'Date', field: 'request_date', align: 'left', },
        { name: 'status', label: 'Status', field: 'status', align: 'left', },
        { name: 'action', label: 'Action', field: 'action', align: 'center' }
      ],
      assignedCheck: [],
      disableCheck: [],
      staffs: [],
      staffNameLabel: [],
      staffID: [],

      saveStaffID:[]
    }
  },
  methods: {
    
    getAllRequests() {
      this.$api.get('/requests')
      .then((res) => {
        if (res.status == 200) {
          console.log(res.data);
          this.requests = res.data
          for(let i = 0;i<this.requests.length; i++) {
            if(this.requests[i].status == "In-progress") {
              this.assignedCheck[i] = true
            }else if(this.requests[i].status == "Rejected"){
              this.disableCheck[i] = true
              this.assignedCheck[i] = true
            }else if(this.requests[i].status == "Completed"){
              this.disableCheck[i] = true
              this.assignedCheck[i] = true
            }
          }
        }
      })
      .catch((err) => {
        Notify.create({
          type: "negative",
          message: "Unauthorized"
        })
        // this.store.clearStore()
      })
    },
    getAllStaffs() {
      this.$api.get('/staffs')
      .then((res) => {
        if (res.status == 200) {
          console.log(res.data)
          this.staffs = res.data
        }
      })
      .catch((err) => {
        Notify.create({
          type: "negative",
          message: "Unauthorized staffs"
        })
        console.log(err);
      })
    },
    getSelectedStaffs() {
      this.$api.get('/staffs/selected')
      .then((res) => {
        if (res.status == 200) {
          console.log(res.data)
          this.staffs = res.data
        }
      })
      .catch((err) => {
        Notify.create({
          type: "negative",
          message: "Unauthorized staffs"
        })
        console.log(err);
      })
    },
    onAssigned(request) {
      const index = this.requests.indexOf(request);
      const data = {
        status: "In-progress",
        staff_id: this.requests[index].staffID
      }
      this.saveStaffID[index]=this.requests[index].staffID
      this.$api.put("/requests/" + request.id, data)
      .then((res) => {
        if(res.status == 200) {
          Notify.create({
            type: "positive",
            message: "In-progress request ID: " + res.data.id
          })
          this.getAllRequests();
        }
      })
      .catch((err)=>{
        console.log(err)
      })
      // if(request.staffNameLabel != null) {
      //   // Change it true at last
      //   this.assignedCheck[index] = !this.assignedCheck[index]
      // }
    
      const data2 = {
        staff_status: true
      }
      
      this.$api.put("/staffs/staff/" + this.requests[index].staffID, data2)
      .then((res) => {
        if(res.status == 200) {
          Notify.create({
            type: "positive",
            message: "staff assigned ID: " + this.requests[index].staffID
          })
          this.getSelectedStaffs();

        }
      })
      .catch((err)=>{
        console.log(err)
      })

      if(this.requests[index].staffNameLabel != null) {
        this.assignedCheck[index] = !this.assignedCheck[index]
      }
      // const index = this.requests.indexOf(request)
      // const length = this.staffs.length
      // let id = 0
      // for(let i = 0; i < length; i++) {
      //   if(this.store.staffs[i].staffId == request.staffID) {
      //     id = this.store.staffs[i].staffId
      //   }
      // }
      // if(request.staffNameLabel != null) {
      //   // Change it true at last
      //   this.store.assignedCheck[index] = true
      //   this.store.requestList[index].status = 'In-progress'
      //   this.store.todoList.push({
      //     requestId: request.requestId,
      //     date: request.date,
      //     address: request.address,
      //     email: request.email,
      //     status: request.status,
      //     staffId: id + ": " + request.staffNameLabel
      //   })
      // }
    },
    onReject(request) {
      console.log(request)
      this.getAllRequests();
      const index = this.requests.indexOf(request);
      const data = {
        status: "Rejected",
        staff_id: this.requests[index].staff_id
      }
      console.log(data)
      this.$api.put("/requests/" + request.id, data)
      .then((res) => {
        if(res.status == 200) {
          Notify.create({
            type: "positive",
            message: "Rejected request ID: " + res.data.id
          })
          this.getAllRequests();
        }
      })
      .catch((err)=>{
        console.log(err)
      })

      const data2 = {
        staff_status:false
      }
      console.log("reject request id " + this.requests[4].id)
      this.$api.put("/staffs/staff/" + this.requests[index].staff_id, data2)
      .then((res) => {
        if(res.status == 200) {
          Notify.create({
            type: "positive",
            message: "staff rejected ID: " + this.saveStaffID[index]
          })
          this.getSelectedStaffs();
        }
      })
      .catch((err)=>{
        console.log(err)
      })
      this.disableCheck[index] = !this.disableCheck[index]
    },
    statusColor(status) {
      for(let i = 0; i < this.requests.length; i++) {
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
  },
  async mounted() {
    //this.dataReady = true
    await this.getAllRequests();
    //await this.getAllStaffs();
    await this.getSelectedStaffs();
  }
})
</script>
