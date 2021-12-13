<template>
  <div>
    Landing Page {{ accessToken }}
    <el-button @click="handleSignOut">Sign out</el-button>
    <el-button @click="testGetList">Get List</el-button>
    <el-button @click="testGet">Get</el-button>
    <el-button @click="testInsert">Insert</el-button>
    <el-button @click="testUpdate">Update</el-button>
    <el-button @click="testDelete">Delete</el-button>
    {{ arrData }}
    {{ dataRecord }}
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ShowMessage from "components/message";
import Utils from 'utils';

export default {
  name: "LandingPage",
  data() {
    return {
      arrData: [],
      dataRecord: {}
    };
  },
  computed: {
    ...mapGetters('auth', ["accessToken"])
  },
  methods: {
    ...mapActions("auth", ["signOut","getList", "insertRecord", "updateRecord", "deleteRecord", "getRecord"]),
    async handleSignOut() {
      const [err, respSignOut] = await this.$awaitTo(this.signOut());

      if (err) {
        this.loading = false;
        new ShowMessage().error(err.message);
      }

      if (respSignOut.code) {
        // new ShowMessage().success(respSignIn.message);
        this.$router.replace("/");
      }
    },
    async testGetList(){
      this.arrData = await this.getList();
    },
    async testGet(){
      this.dataRecord = await this.getRecord('5doSHLzeLlkarEITbdeA');
    },
    testInsert(){
      const utils = new Utils();
      utils.asyncForEach(Array.from({length: 50}, (_, i) => i + 1), async item => {
        await this.insertRecord({data: {email: `test${item}@gmail.com`}});
      });
      
      new ShowMessage().success('Inserted');
    },
    async testUpdate(){
      await this.updateRecord({data: {email: 'abcd@gmail.com'}, documentId: '5doSHLzeLlkarEITbdeA'});
      new ShowMessage().success('Updated');
    },
    async testDelete(){
      await this.deleteRecord({documentId: '5doSHLzeLlkarEITbdeA'});
      new ShowMessage().success('Deleted');
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
