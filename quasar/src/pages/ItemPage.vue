<template>
  <q-page>
    <div class="row q-mt-lg">
      <div class="col">
        <div style="max-width:650px; text-align:center; margin-left:auto; margin-right:auto">
          <!-- Category section -->
          <q-list class="rounded-borders">
            <q-expansion-item
              class="shadow-1 overflow-hidden"
              style="border-radius: 30px"
              icon="category"
              label="Category List"
              header-class="bg-primary text-white"
              expand-icon-class="text-white"
            >
              <q-card>
                <q-card-section>
                  <q-table
                    title="Category"
                    :rows="categories"
                    :columns="categoryCols"
                    row-key="id"
                  >
                    <template #top-right>
                      <q-form
                        ref="myCategoryForm"
                        @submit.prevent="onAddCategory()"
                        @reset="onResetCategory()"
                        class="q-gutter-sm row"
                        dense
                      >
                        <q-input
                          outlined
                          v-model="category"
                          label="Category *"
                          lazy-rules
                          :rules="[ val => val && val.length > 0 || 'Please type something']"
                          dense
                          class="q-py-md q-px-xs"
                          style="size: 15px"
                        />
                        <div class="q-py-md">
                          <q-btn label="Add" type="submit" color="primary"/>
                          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                        </div>
                      </q-form>
                    </template>
                    <template #body="props">
                      <q-tr>
                        <q-td key="id" :props="props">
                          {{ props.row.id }}
                        </q-td>
                        <q-td key="name" :props="props">
                          {{ props.row.name }}
                        </q-td>
                        <q-td key="actions" :props="props">
                          <div class="q-ma-sm">
                            <!-- <q-btn
                              class="q-pa-sm q-mx-sm"
                              :icon="editCategory[this.categories.indexOf(props.row)] ? 'edit' : 'edit_off'"
                              :color="editCategory[this.categories.indexOf(props.row)] ? 'primary' : 'red'"
                              @click="onEditCategory(props.row)" 
                              :disabled="visibleCategory[this.categories.indexOf(props.row)]? '':disabled"
                            >
                            </q-btn> -->
                            <q-btn
                              class="q-pa-sm q-mx-sm"
                              :icon="editCategory[this.categories.indexOf(props.row)] ? 'edit' : 'edit_off'"
                              :color="editCategory[this.categories.indexOf(props.row)] ? 'primary' : 'red'"
                              @click="onEditCategory(props.row)" 
                              :disabled="visibleCategory[this.categories.indexOf(props.row)]? '':disabled"
                            >
                            </q-btn>
                            <!-- <q-btn 
                              class="q-pa-sm"
                              icon="delete"
                              color="red"
                              @click="onDeleteCategory(props.row)" 
                              :disabled="store.visibleCategory[this.store.categories.indexOf(props.row)]? '':disabled"
                            >
                              <q-tooltip class="bg-accent">Delete</q-tooltip>
                            </q-btn> -->
                            <!-- <q-icon 
                              :name="store.visibleCategory[this.categories.indexOf(props.row)] ? 'visibility_off' : 'visibility'" 
                              class="cursor-pointer q-ma-sm"
                              @click="onVisibleCategory(props.row)"
                              size="sm"
                            /> -->
                          </div>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
          <br />
          <!-- Product section -->
          <q-list class="rounded-borders">
            <q-expansion-item
              class="shadow-1 overflow-hidden"
              style="border-radius: 30px"
              icon="recycling"
              label="Product List"
              header-class="bg-primary text-white"
              expand-icon-class="text-white"
            >
              <q-card>
                <q-card-section>
                  <q-table
                    title="Products"
                    :rows="items"
                    :columns="itemCols"
                    row-key="name"
                  >
                    <template #top-right="props">
                      <q-form
                        ref="myItemForm"
                        @submit.prevent="onAddProduct(props.row)"
                        @reset="onResetProduct()"
                        class="q-gutter-sm row"
                        dense
                        :props="props"
                      >
                        <div class="row">
                          <q-input
                            outlined
                            v-model="item"
                            label="Product *"
                            lazy-rules
                            :rules="[ val => val && val.length > 0 || 'Please type something']"
                            dense
                            class="q-py-md q-px-xs"
                            style="size: 10px"
                          />
                          <q-input
                            outlined
                            type="number"
                            v-model="price"
                            label="Price/kg *"
                            lazy-rules
                            :rules="[
                              val => val !== null && val !== '' || 'Please type price',
                              val => val > 0  || 'Please type a valid price'
                            ]"
                            dense
                            class="q-py-md q-px-xs"
                          />
                          <div class="q-pa-xs">
                            <q-btn-dropdown
                              key="label" 
                              :props="props"
                              color="primary" 
                              :label="label"
                              lazy-rules
                              :rules="[rule]"
                              aria-errormessage="errormessage"
                            >
                              <q-list>
                                <q-item 
                                  v-for="(category, index) in categories"
                                  :key="index"
                                  clickable v-close-popup 
                                  @click="label= category.name"
                                >
                                  <q-item-section>
                                    <q-item-label>{{ category.name }}</q-item-label>
                                  </q-item-section>
                                </q-item>
                              </q-list>
                            </q-btn-dropdown>
                          </div>
                          <div align="center">
                            <q-btn label="Add" type="submit" color="primary" />
                            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                          </div>
                        </div>
                      </q-form>
                    </template>
                    <template #body="props">
                      <q-tr>
                        <q-td key="id" :props="props">
                          {{ props.row.id }}
                        </q-td>
                        <q-td key="name" :props="props">
                          {{ props.row.name }}
                          <!-- <q-popup-edit 
                            v-if="editProduct[this.store.products.indexOf(props.row)]"
                            v-model.number="props.row.name"
                            buttons v-slot="scope"
                          >
                            <q-input type="text" v-model="scope.value" dense autofocus @keyup.enter="scope.set" 
                              lazy-rules
                              :rules="[ val => val && val.length > 0 || 'Please type something']"
                            />
                          </q-popup-edit> -->
                        </q-td>
                        <q-td key="price" :props="props">
                          {{ props.row.price }}
                          <!-- <q-popup-edit 
                            v-if="editProduct[this.store.products.indexOf(props.row)]"
                            v-model.number="props.row.price"
                            buttons 
                            v-slot="scope"
                            :validate="onProductPriceValidation"
                            @hide="onProductPriceValidation"
                          >
                          <q-input 
                            type="number" 
                            v-model.number="scope.value" 
                            :error="errorPrice"
                            :error-message="errorMessagePrice"
                            dense 
                            autofocus 
                            @keyup.enter="scope.set" 
                          />
                          </q-popup-edit> -->
                        </q-td>
                        <q-td key="category_id" :props="props">
                          {{ props.row.category_id }}
                        </q-td>
                        <q-td key="actions" :props="props">
                          <!-- <div class="q-pa-sm">
                            <q-btn 
                              class="q-pa-sm q-mx-sm" 
                              :icon="editProduct[this.store.products.indexOf(props.row)] ? 'edit' : 'edit_off'"
                              :color="editProduct[this.store.products.indexOf(props.row)] ? 'primary' : 'red'"
                              @click="onEditProduct(props.row)"
                              :disabled="store.visibleProduct[this.store.products.indexOf(props.row)]? '':disabled"
                            />
                            <q-btn 
                              class="q-pa-sm" 
                              color="red" 
                              icon="delete" 
                              @click="onDeleteProduct(props.row)" 
                              :disabled="store.visibleProduct[this.store.products.indexOf(props.row)]? '':disabled"
                            />
                            <q-icon 
                              :name="store.visibleProduct[this.store.products.indexOf(props.row)] ? 'visibility_off' : 'visibility'" 
                              class="cursor-pointer q-ma-sm"
                              @click="onVisibleProduct(props.row)"
                              size="sm"
                            />
                          </div> -->
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
          <br />
          <!-- Staff section -->
          <q-list class="rounded-borders">
            <q-expansion-item
              class="shadow-1 overflow-hidden"
              style="border-radius: 30px"
              icon="engineering"
              label="Staff List"
              header-class="bg-primary text-white"
              expand-icon-class="text-white"
            >
              <q-card>
                <q-card-section>
                  <q-table
                    class="q-ma-md"
                    title="Staff List"
                    :rows="staffs"
                    :columns="staffCols"
                    row-key="name"
                  >
                    <template #top-right>
                      <q-form
                        ref="refStaff"
                        @submit.prevent="onAddStaff"
                        @reset="onResetStaff"
                        class="q-gutter-sm row"
                        dense
                      >
                        <q-input
                          filled
                          v-model="staff"
                          label="Staff *"
                          lazy-rules
                          :rules="[ val => val && val.length > 0 || 'Please type something']"
                          dense
                          class="q-py-md q-px-xs"
                        />
                        <div class="q-py-md">
                          <q-btn label="Add" type="submit" color="primary"/>
                          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                        </div>
                      </q-form>
                    </template>
                    
                    <template #body="props">
                      <q-tr>
                        <q-td key="id" :props="props">
                          {{ props.row.id }}
                        </q-td>
                        <q-td key="name" :props="props">
                          {{ props.row.name }}
                          <!-- <q-popup-edit 
                            v-if="editStaff[this.store.staffs.indexOf(props.row)]"
                            v-model.number="props.row.name"
                            buttons v-slot="scope"
                          >
                            <q-input type="text" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
                          </q-popup-edit> -->
                        </q-td>
                        <q-td key="actions" :props="props">
                          <!-- <div class="q-pa-sm">
                            <q-btn 
                              class="q-ma-sm q-pa-sm"
                              :icon="editStaff[this.store.staffs.indexOf(props.row)] ? 'edit' : 'edit_off'"
                              :color="editStaff[this.store.staffs.indexOf(props.row)] ? 'blue' : 'red'"
                              @click="onEditStaff(props.row)"
                              dense
                              :disabled="store.visibleStaff[this.store.staffs.indexOf(props.row)]? '':disabled"
                            >
                              <q-tooltip class="bg-accent">Edit</q-tooltip>
                            </q-btn>
                            <q-btn class="q-pa-sm" name="delete" icon='delete' color="red" @click="onDeleteStaff(props.row)" :disabled="store.visibleStaff[this.store.staffs.indexOf(props.row)]? '':disabled">
                              <q-tooltip class="bg-accent">Delete</q-tooltip>
                            </q-btn>
                            <q-icon 
                              :name="store.visibleStaff[this.store.staffs.indexOf(props.row)] ? 'visibility_off' : 'visibility'" 
                              class="cursor-pointer q-ma-sm"
                              @click="onVisibleStaff(props.row)"
                              size="sm"
                            />
                          </div> -->
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
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
  name: 'ItemPage',
  data() {
    return {
      store: userStore(),
      // category
      categories: [],
      categoryCols: [
        { name: 'id', label: 'Category ID', field: 'id', align: 'center'},
        { name: 'name', label: 'Name', field: 'name',align: 'center',  },
        { name: 'actions', label: 'Actions', field: 'actions', align: 'center', }
      ],
      category: '',
      //category_id: '',
      editCategory: [],
      visibleCategory: [],

      // product
      items: [],
      itemCols: [
        { name: 'id', label: 'Product ID', field: 'id', align: 'left'},
        { name: 'name', label: 'Name', field: 'name',align: 'left',  },
        { name: 'price', label: 'Price', field: 'price',align: 'left',  },
        { name: 'category_id', label: 'Category ID', field: 'category_id',align: 'left',  },
        { name: 'actions', label: 'Actions', field: 'actions', align: 'center', }
      ],
      item: '',
      price: '',
      label: 'category',
      selectedCategory: '',

      // staff
      //users: [],
      staff: '',
      staffs: [],
      staffCols: [
        { name: 'id', required: true, label: 'Staff ID', field: 'id', align: 'left'},
        { name: 'name', label: 'Name', field: 'name',align: 'left',  },
        { name: 'actions', label: 'Actions', field: 'actions', align: 'center', }
      ],
    }
  },
  methods: {
    getAllCategories() {
      this.$api.get('/categories')
      .then((res) => {
        if (res.status == 200) {
          console.log(res.data);
          this.categories = res.data
        }
      })
      .catch((err) => {
        Notify.create({
          type: "negative",
          message: "Unauthorized categories"
        })
        // this.store.clearStore()
        // this.$router.push("/login")
        console.log(err);
      })
    },
    
    getAllItems() {
      this.$api.get('/items')
      .then((res) => {
        if (res.status == 200) {
          // console.log(res.data);
          this.items = res.data
        }
      })
      .catch((err) => {
        Notify.create({
          type: "negative",
          message: "Unauthorized items"
        })
        // this.store.clearStore()
        // this.$router.push("/login")
        console.log(err);
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
        // this.store.clearStore()
        console.log(err);
      })
    },
    onAddCategory() {
      //console.log(this.category)
      const data = {
        name: this.category,
        visible: false
      }
      this.$api.post('/categories/create', data)
      .then((res) => {
        if(res.status == 200) {
          console.log("created category");
          Notify.create({
            type: "positive",
            message: "Created category"
          })
          this.getAllCategories()
          this.$refs.myCategoryForm.reset()
        }
      })
      .catch((err) => {
        console.log(err);
      })
    },
    onAddProduct() {
      let c_id = 0;
      for(let i=0; i < this.categories.length; i++) {
        if(this.label == this.categories[i].name) {
          c_id = this.categories[i].id
        }
      }
      const data = {
        name: this.item,
        price: this.price,
        category_id: c_id,
        visible: false
      }
      this.$api.post('/items/create', data)
      .then((res) => {
        if(res.status == 200) {
          console.log("created item: " + res.data);
          Notify.create({
            type: "positive",
            message: "Created item"
          })
          //console.log(res.data.request_date)
          this.getAllItems()
          this.$refs.myItemForm.reset()
        }
      })
      .catch((err) => {
        console.log(err);
      })
    },
    onAddStaff() {
      const data = {
        name: this.staff,
        visible: false
      }
      this.$api.post('/staffs/create', data)
      .then((res) => {
        if(res.status == 200) {
          console.log("add staff: " + res.data);
          Notify.create({
            type: "positive",
            message: "Add staff"
          })
          //console.log(res.data.request_date)
          this.getAllStaffs()
          this.$refs.refStaff.reset()
        }
      })
      .catch((err) => {
        console.log(err);
      })
    },
    onResetCategory() {
      this.category = ''
    },
    onResetProduct() {
      this.item = ''
      this.price = ''
      this.label = 'category'
    },
    onEditCategory(category){
      const index = this.categories.indexOf(category)
      this.editCategory[index] = !this.editCategory[index]
    },
    onAfterEditCategory(category) {
      console.log(category)
      const data = {
        name: category.name
      }
      console.log(data)
      this.$api.put("/categories/" + category.id, data)
      .then((res) => {
        Notify.create({
          type: "positive",
          message: "Updated category ID: " + res.data.id
        })
        this.getAllCategories();
      })
      .catch((err)=>{
        console.log(err)
      })
      // const index = this.store.categories.indexOf(category)
      // for(let i=0; i<this.store.products.length; i++){
      //   if(this.store.products[i].category==this.newval){
      //     this.store.products[i].category= this.store.categories[index].name
      //   }
      // }
      // console.log("aaa")
      // console.log(this.newval)
      // console.log(this.store.categories[0].name)
    },
  },
  async mounted() {
    await this.getAllCategories();
    await this.getAllItems();
    await this.getAllStaffs();
    //await this.getAllUsers();
  }
})
</script>
