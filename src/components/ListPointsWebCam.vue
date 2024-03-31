<template>
  <div>
    <v-list style="overflow-y: scroll">
      <v-list-item-group color="primary">
        <v-list three-line>
          <template v-for="(item, index) in points">
            <v-divider :key="index"></v-divider>
            <v-list-item :key="item.name">
              <v-list-item-action>
                <v-btn
                  fab
                  depressed
                  color="green"
                  @click="openDialogEditObject(item)"
                >
                  {{ item.codeOfObject }}
                </v-btn>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title v-html="item.orgName"></v-list-item-title>
                <v-list-item-subtitle
                  v-html="item.address"
                ></v-list-item-subtitle>
                <v-list-item-subtitle
                  v-html="item.codeOfObject"
                ></v-list-item-subtitle>
              </v-list-item-content>
              <!-- 
              <v-list-item-action>
                <v-btn
                  class="ma-2"
                  outlined
                  color="indigo"
                  @click="openDialogForAddingToTask(item)"
                >
                  В задачу
                </v-btn>
              </v-list-item-action> -->
            </v-list-item>
          </template>
        </v-list>
      </v-list-item-group>
    </v-list>
    <v-fab-transition>
      <v-btn
        color="pink"
        dark
        fixed
        bottom
        right
        fab
        class="mb-12"
        @click="openDialogNewObject()"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>

    <v-dialog
      v-model="dialogNewObject"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialogNewObject = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ addPointTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="saveNewObject()"> Сохранить </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader>
          <!-- <v-subheader>Новый обьект</v-subheader> -->
          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="orgName"
                :counter="10"
                :rules="nameRules"
                label="Наименование организации"
                required
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="codeOfObject"
                :counter="10"
                label="Номер объекта"
                required
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field v-model="sim" label="Номер sim"></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="address"
                label="Адрес обслуживания"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-select
                v-model="districtObject"
                :items="districts"
                item-text="text"
                item-value="_uuid"
                return-object
                :rules="[(v) => !!v || 'Item is required']"
                label="Район"
                required
              ></v-select>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="fireSafetyOfficer"
                label="Ответственный за пожарную безопасность"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field v-model="employee" label="Сотрудник"></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="paperAct"
                label="Акт бумажный"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="electronicAct"
                label="Акт электронный"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list three-line>
                <v-subheader>Ремарки</v-subheader>
                <template v-for="(remark, index) in remarks">
                  <v-divider :key="index"></v-divider>
                  <v-list-item :key="remark._id">
                    <v-list-item-content
                      ><v-textarea
                        rows="2"
                        v-model="remark.content"
                        label="Ремарка"
                        required
                      ></v-textarea
                    ></v-list-item-content>
                    <v-list-item-action>
                      <v-btn
                        class="ma-1"
                        color="error"
                        plain
                        outlined
                        large
                        fab
                        @click="deleteRemarkLocal(remark)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </template>
                <v-btn class="ma-2" outlined color="indigo" @click="addRemark">
                  Доебать ремарку
                </v-btn>
              </v-list>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list three-line subheader>
          <v-subheader>General</v-subheader>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="maintain"></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Обслуживать</v-list-item-title>
              <v-list-item-subtitle
                >На данный момент отбьект не требуется
                проверять</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogEditObject"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialogEditObject = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Редактрировать обьект</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="saveEditObject()"> Сохранить </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader>
          <v-subheader>Редактируемый обьект</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="orgName"
                :counter="10"
                :rules="nameRules"
                label="Наименование организации"
                required
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="codeOfObject"
                :counter="10"
                label="Номер объекта"
                required
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field v-model="sim" label="Номер sim"></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="address"
                label="Адрес обслуживания"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-select
                v-model="districtObject"
                :items="districts"
                item-text="text"
                item-value="_uuid"
                :rules="[(v) => !!v || 'Item is required']"
                label="Район"
                required
                return-object
              ></v-select>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="fireSafetyOfficer"
                label="Ответственный за пожарную безопасность"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field v-model="employee" label="Сотрудник"></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="paperAct"
                label="Акт бумажный"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="electronicAct"
                label="Акт электронный"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <web-cam
            ref="webcam"
            width="100%"
            :deviceId="deviceId"
            @started="onStarted"
            @stopped="onStopped"
            @error="onError"
            @cameras="onCameras"
            @camera-change="onCameraChange"
            :isFrontCam="frontCam"
            :debug="true"
          />
          <v-list-item>
            <v-list-item-content>
              <v-list three-line>
                <v-subheader>Ремарки</v-subheader>
                <template v-for="(remark, index) in remarks">
                  <v-divider :key="index"></v-divider>
                  <v-list-item :key="remark._uuid">
                    <v-list-item-content
                      ><v-textarea
                        rows="2"
                        v-model="remark.content"
                        label="Ремарка"
                        required
                      ></v-textarea
                    ></v-list-item-content>
                    <v-list-item-action>
                      <v-btn
                        class="ma-1"
                        color="error"
                        plain
                        outlined
                        large
                        fab
                        @click="deleteRemarkRemote(remark)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </template>
                <v-btn class="ma-2" outlined color="indigo" @click="addRemark">
                  Доебать ремарку
                </v-btn>
              </v-list>
            </v-list-item-content>
          </v-list-item>
          <!-- <v-list-item>
            <v-list-item-content>
              <v-textarea
                v-model="remarks"
                label="Пометка"
                required
              ></v-textarea>
            </v-list-item-content>
          </v-list-item> -->
        </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-item>
            <v-list-item-content> </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list three-line subheader>
          <v-subheader>General</v-subheader>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="maintain"></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Обслуживать</v-list-item-title>
              <v-list-item-subtitle
                >На данный момент отбьект не требуется
                проверять</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="enable"></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Пометить на удаление</v-list-item-title>
              <v-list-item-subtitle
                >По умолчанию не будет отображаться в
                списке.</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogForAddingToTask" max-width="500px">
      <v-card>
        <v-card-title> Добавление в задачу </v-card-title>
        <v-card-text>
          <v-select
            v-model="task"
            :items="tasks"
            label="Добавить в задачу"
            item-text="taskDate"
            item-value="_uuid"
            return-object
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="dialogForAddingToTask = false">
            Закрыть
          </v-btn>
          <v-btn color="primary" text @click="addToTask()"> Сохранить </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters, mapActions } from "vuex";
import { v4 as uuidv4 } from "uuid";
import { filter, head } from "lodash";
import { WebCam } from "vue-cam-vision";

export default {
  components: { WebCam },
  data: () => ({
    img: null,
    camera: null,
    deviceId: null,
    devices: [],
    frontCam: true,
    report: null,
    addPointTitle: "Добавить обьект",
    _uuid: "",
    selectPoint: null,
    hidden: false,
    dialogNewObject: false,
    dialogEditObject: false,
    dialogForAddingToTask: false,
    sound: true,
    widgets: false,
    maintain: false,
    valid: true,
    orgName: "",
    codeOfObject: 0,
    sim: "",
    address: "",
    districtObject: null,
    district: null,
    fireSafetyOfficer: "",
    employee: "",
    paperAct: "",
    electronicAct: "",
    codeOfObject: 0,
    remarks: [],
    contact: "",
    uuid: "",
    enable: null,
    task: null,
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 80) || "Name must be less than 40 characters",
    ],
  }),
  computed: {
    ...mapGetters({
      districts: "getterDistricts",
      points: "getterPoints",
      draft: "getterDraft",
      getterPoint: "getterPoint",
    }),
    okoObjects() {
      return this.$store.state.points;
    },
    tasks() {
      return this.$store.state.tasks;
    },
    device: function () {
      return find(this.devices, n => n.deviceId == this.deviceId)
    }
  },
  methods: {
    ...mapActions([
      "getPoints",
      "setTitle",
      "setLoading",
      "updateDraft",
      "getDraft",
      "getPoint",
    ]),
    onCameras(cameras) {
      this.devices = cameras;
      console.log("On Cameras Event", cameras);
    },
    onCameraChange(deviceId) {
      this.deviceId = deviceId;
      this.camera = deviceId;
      console.log("On Camera Change Event", deviceId);
    },
    addRemark() {
      let remark = null;
      remark = {
        _id: uuidv4(),
        content: "Комментарий",
        type: "text",
      };
      this.remarks.push(remark);
    },
    deleteRemarkLocal(remark) {
      this.remarks = filter(this.remarks, (r) => r._id !== remark._id);
    },
    deleteRemarkRemote(remark) {
      this.remarks = filter(this.remarks, (r) => r._id !== remark._id);
    },
    convertDate(date) {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      var newDate = new Date(date);
      return newDate.toLocaleDateString("RU-ru", options);
    },
    openDialogForAddingToTask(point) {
      this.selectPoint = { ...point };
      this.dialogForAddingToTask = true;
    },
    async openDialogNewObject() {
      const draft = await this.$store.dispatch("getDraft");
      this.remarks = [];
      let remark = null;
      (remark = {
        _id: uuidv4(),
        content: "Комментарий",
        type: "text",
      }),
        this.remarks.push(remark);
      this.orgName = this.draft.orgName;
      this.maintain = this.draft.maintain;
      this.codeOfObject = this.draft.codeOfObject;
      this.sim = this.draft.sim;
      this.remarks = this.remarks;
      this.address = this.draft.address;
      this.districtObject = null;
      this.districtId = this.draft.districtId;
      this.fireSafetyOfficer = this.draft.fireSafetyOfficer;
      this.employee = this.draft.employee;
      this.paperAct = this.draft.paperAct;
      this.electronicAct = this.draft.electronicAct;
      this.dialogNewObject = true;
    },
    async saveNewObject() {
      const newObject = {
        orgName: this.orgName.trim(),
        maintain: this.maintain,
        codeOfObject: this.codeOfObject,
        sim: this.sim.trim(),
        address: this.address.trim(),
        districtId: this.districtObject._uuid,
        fireSafetyOfficer: this.fireSafetyOfficer.trim(),
        employee: this.employee.trim(),
        paperAct: this.paperAct.trim(),
        electronicAct: this.electronicAct.trim(),
        remarks: this.remarks,
        maintain: this.maintain,
      };
      if (newObject.orgName && newObject.codeOfObject) {
        try {
          await this.setLoading(false);
          await this.$store.dispatch("addPoint", newObject);
          await this.getPoints();
          await this.setLoading(true);
          this.$store.dispatch("setMessage", "Сохранено!");
        } catch (error) {
          this.$store.dispatch("setError", "Ошибка!");
          await this.setLoading(true);
        }
      }
      this.dialogNewObject = false;
    },
    async openDialogEditObject(val) {
      await this.getPoint(val._uuid);
      this._uuid = val._uuid;
      this.orgName = this.getterPoint.orgName.trim();
      this.maintain = this.getterPoint.maintain;
      this.enable = this.getterPoint.enable;
      this.codeOfObject = this.getterPoint.codeOfObject;
      this.remarks = this.getterPoint.remarks;
      this.address = this.getterPoint.address.trim();
      this.districtId = this.getterPoint.districtId;
      this.districtObject = this.districts.filter(
        (v) => v._uuid === val.districtId
      )[0];
      this.fireSafetyOfficer = this.getterPoint.fireSafetyOfficer.trim();
      this.employee = this.getterPoint.employee.trim();
      this.paperAct = this.getterPoint.paperAct.trim();
      this.electronicAct = this.getterPoint.electronicAct.trim();
      this.sim = this.getterPoint.sim.trim();
      this.dialogEditObject = true;
    },
    async saveEditObject() {
      await this.$store.dispatch("updatePoint", {
        _uuid: this._uuid,
        orgName: this.orgName,
        maintain: this.maintain,
        sim: this.sim,
        electronicAct: this.electronicAct,
        paperAct: this.paperAct,
        employee: this.employee,
        enable: this.enable,
        codeOfObject: this.codeOfObject,
        districtId: this.districtObject._uuid,
        fireSafetyOfficer: this.fireSafetyOfficer,
        remarks: this.remarks,
        address: this.address,
        contact: this.contact,
        enable: this.enable,
      });
      await this.setLoading(false);
      await this.getPoints();
      await this.setLoading(true);
      this.dialogEditObject = false;
    },
    async addToTask() {
      try {
        await this.setLoading(false);
        await this.$store.dispatch("updatePointToTask", {
          task: this.task,
          point: this.selectPoint,
        });
        await this.getPoints();
        await this.setLoading(true);
        this.$store.dispatch("setMessage", "Сохранено!");
        this.dialogForAddingToTask = false;
        this.selectPoint = null;
      } catch (error) {
        await this.setLoading(true);
        this.$store.dispatch("setError", "Ошибка!");
      }
    },
    // cam
    async sendGVision () {
      const res = await this.$refs.webcam.googleVision()
      console.log(res)
      this.report = res.labelAnnotations
    },
    async onCapture () {
      this.img = await this.$refs.webcam.capture()
    },
    onStarted (stream) {
      console.log('On Started Event', stream)
    },
    onStopped (stream) {
      console.log('On Stopped Event', stream)
    },
    onStop () {
      this.$refs.webcam.stop()
    },
    onStart () {
      this.$refs.webcam.start()
    },
    onError (error) {
      console.log('On Error Event', error)
    },
    onCameras (cameras) {
      this.devices = cameras
      console.log('On Cameras Event', cameras)
    },
    onCameraChange (deviceId) {
      this.deviceId = deviceId
      this.camera = deviceId
      console.log('On Camera Change Event', deviceId)
    }
  },
  watch: {
    camera: function (id) {
      this.deviceId = id
    },
    devices: function () {
      if (typeof window.orientation === 'undefined') {
        // Once we have a list select the first one
        let first = head(this.devices)
        if (first) {
          this.camera = first.deviceId
          this.deviceId = first.deviceId
        }
      } else {
        this.frontCam = false
      }
    }
  },
  filters: {
    percent: function (value) {
      if (!value) return ''
      return (Math.floor((value) * 10000) / 100).toFixed(0) + '%'
    }
  },
  async mounted() {
    await this.setLoading(false);
    await this.getPoints();
    await this.setLoading(true);
  },
};
</script>

<style>
#oop {
  padding-bottom: 100px;
}
</style>
