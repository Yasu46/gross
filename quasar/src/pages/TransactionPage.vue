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
                <q-badge :color="statusColor(props.row)">
                  {{props.row.status}}
                </q-badge>
              </q-td>
            </template>

            <template #body-cell-action="props">
              <q-td :props="props">
                <div class="q-pa-md">
                  <!-- <q-btn-dropdown
                    dense
                    :value="props.row.staffID"
                    :label="props.row.staffNameLabel"
                    icon="engineering" 
                    color="primary"
                    :disabled="this.store.assignedCheck[this.store.requestList.indexOf(props.row)] ? '' : disabled"
                  >
                    <q-list>
                      <q-item 
                        clickable 
                        v-close-popup 
                        @click="props.row.staffNameLabel = staff.name, props.row.staffID = staff.staffId"
                        v-for="(staff,index) in renewStaffs"
                        :key="index"
                      >
                        <q-item-section>
                          <q-item-label>{{staff.staffId}}: {{staff.name}}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown> -->
                  <q-btn
                    dense
                    :color="assignedCheck[requests.indexOf(props.row)] ? 'green-8' : 'grey-8'"
                    :icon="assignedCheck[requests.indexOf(props.row)] ? 'check' : 'unchecked'"
                    @click="onAssigned(props.row)"
                    :disabled="assgnedCheck[requests.indexOf(props.row)] ? '' : disabled"
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
      disableCheck: []
    }
  },
  methods: {
    getAllRequests() {
      this.$api.get('/requests')
      .then((res) => {
        if (res.status == 200) {
          console.log(res.data);
          this.requests = res.data
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
  }
})
</script>
