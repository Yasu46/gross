<template>
  <q-page class="flex-center q-pa-sm">
    <q-card class="q-mt-sm">
      <q-card-section class="text-h6 q-pb-none">
        <q-item>
          <q-item-section avatar class="">
            <q-icon color="blue" name="trending_up" size="44px"/>
          </q-item-section>

          <q-item-section>
            <div class="text-h6">Dash Board</div>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-section class="row">
        <div class="col-lg-7 col-sm-12 col-xs-12 col-md-7">
          <div class="col-lg-3 col-md-3 col-xs-6 col-sm-6">
            <q-item>
              <q-item-section top avatar>
                <q-avatar color="blue" text-color="white" icon="handshake"/>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-h6 text-blue text-bold">{{ totalTransaction }}</q-item-label>
                <q-item-label caption>Total Transaction</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <hr/>
          <div class="col-lg-5 col-sm-12 col-xs-12 col-md-5">
            <q-item>
              <q-item-section avatar class="">
                <q-icon color="blue" name="assessment" class="q-pl-md" size="44px"/>
              </q-item-section>
              <q-item-section>
                <div class="text-h6">Today's Transaction</div>
              </q-item-section>
              <q-item-section>
                <div class="text-h6">{{ this.printDate() }}</div>
              </q-item-section>
            </q-item>
            <div class="row">
              <div class="col-lg-3 col-md-3 col-xs-6 col-sm-6">
                <q-item>
                  <q-item-section top avatar>
                    <q-avatar color="blue-8" text-color="white" icon="receipt_long"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-h6 text-blue-8 text-bold">{{ this.todayTransaction }}</q-item-label>
                    <q-item-label caption>Transaction</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
              <div class="col-lg-3 col-md-3 col-xs-6 col-sm-6">
                <q-item>
                  <q-item-section top avatar>
                    <q-avatar color="grey-8" text-color="white" icon="pending_actions"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-h6 text-grey-8 text-bold">{{ this.numOfPending }}</q-item-label>
                    <q-item-label caption>Pending</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
              <div class="col-lg-3 col-md-3 col-xs-6 col-sm-6">
                <q-item>
                  <q-item-section top avatar>
                    <q-avatar color="green-6" text-color="white" icon="autorenew"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-h6 text-green-6 text-bold">{{ this.numOfInprogress }}</q-item-label>
                    <q-item-label caption>In-progress</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
              <div class="col-lg-3 col-md-3 col-xs-6 col-sm-6">
                <q-item>
                  <q-item-section top avatar>
                    <q-avatar color="orange-8" text-color="white" icon="delete_forever"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-h6 text-orange-8 text-bold">{{ this.numOfRejected }}</q-item-label>
                    <q-item-label caption>Rejected</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { userStore } from "../stores/user-store"
import { Notify } from "quasar"

export default defineComponent({
  name: 'DashBoardPage',
  data() {
    return {
      store: userStore(),
      totalTransaction: 0,
      todayTransaction: 0,
      numOfPending: 0,
      numOfInprogress: 0,
      numOfRejected: 0
    }
  },
  methods: {
    getAllTransactions() {
      this.$api.get('/requests/transaction/total')
      .then((res) => {
        if (res.status == 200) {
          //console.log(res.data);
          this.totalTransaction = res.data[0].total
        }
      })
      .catch((err) => {
        Notify.create({
          type: "negative",
          message: "Unauthorized"
        })
      })
    },
    getTodayTransactions() {
      this.$api.get('/requests/today/' + this.printDate())
      .then((res) => {
        if (res.status == 200) {
          //console.log(res.data);
          this.todayTransaction = res.data[0].total
        }
      })
      .catch((err) => {
        Notify.create({
          type: "negative",
          message: "Unauthorized"
        })
      })
    },
    getTotalPending() {
      this.$api.get('/requests/total/pending/' + this.printDate())
      .then((res) => {
        if (res.status == 200) {
          //console.log(res.data);
          this.numOfPending = res.data[0].total
        }
      })
      .catch((err) => {
        Notify.create({
          type: "negative",
          message: "Unauthorized"
        })
      })
    },
    getTotalInProgress() {
      this.$api.get('/requests/total/progress/' + this.printDate())
      .then((res) => {
        if (res.status == 200) {
          //console.log(res.data);
          this.numOfInprogress = res.data[0].total
        }
      })
      .catch((err) => {
        Notify.create({
          type: "negative",
          message: "Unauthorized"
        })
      })
    },
    getTotalRejected() {
      this.$api.get('/requests/total/rejected/' + this.printDate())
      .then((res) => {
        if (res.status == 200) {
          //console.log(res.data);
          this.numOfRejected = res.data[0].total
        }
      })
      .catch((err) => {
        Notify.create({
          type: "negative",
          message: "Unauthorized"
        })
      })
    },
    printDate() {
      let today = new Date();
      let format = today.getFullYear() + "-" + (today.getMonth() + 1) + "-"+ today.getDate()
      //let printToday = moment(format).format("YYYY-MM-DD")
      return format
    },
  },
  async mounted() {
    await this.getAllTransactions();
    await this.getTodayTransactions();
    await this.getTotalPending();
    await this.getTotalInProgress();
    await this.getTotalRejected();
  }
})
</script>
