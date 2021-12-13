<template>
  <div v-loading.fullscreen.lock="isLoading">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column width="50" align="center">
        <template slot-scope="scope">{{
          page * 10 - 9 + scope.$index
        }}</template>
      </el-table-column>
      <el-table-column prop="email" label="Email"> </el-table-column>
      <el-table-column prop="created_by" label="Created By"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      tableData: [],
      page: 1,
      pageSize: 10,
      isLoading: false,
    };
  },
  methods: {
      ...mapActions("auth", ["getList"])
  },
  async created() {
    this.isLoading = true;
    this.tableData = await this.getList();
    this.isLoading = false;
  },
};
</script>