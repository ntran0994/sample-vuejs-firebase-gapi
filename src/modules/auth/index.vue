<template>
  <div class="login-body" v-loading.fullscreen.lock="isLoading">
    <button class="social-btn-google fxac" type="button" @click="handleSignIn">
      <i class="udi udi-google-plus social-icon"></i>
      Sign in with Google
      <span class="udi udi-circle-loader udi-small hidden"></span>
    </button>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import ShowMessage from "components/message";

export default {
  name: "Auth",
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    ...mapActions("auth", ["signIn"]),
    async handleSignIn() {
      this.isLoading = true;

      const [err, respSignIn] = await this.$awaitTo(this.signIn());

      if (err) {
        this.loading = false;
        new ShowMessage().error(err.message);
      }

      if (respSignIn.code) {
        // new ShowMessage().success(respSignIn.message);
        this.$router.replace("/home");
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.login-body {
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
}

/* Google Button CSS */
.social-btn-google {
  background-color: #fff;
  border: none;
  color: #686f7a;
  cursor: pointer;
  box-shadow: 0 2px 2px 0 rgba(41, 48, 59, 0.24),
    0 0 2px 0 rgba(41, 48, 59, 0.12);
  border-radius: 2px;
  padding: 0 20px 0 10px;
  font-size: 16px;
  font-weight: 700;
  margin: 20px auto 0 auto;
}

.social-btn-google .udi-google-plus {
  background: url(../../assets/images/google-logo.svg) no-repeat 50%;
  background-size: 24px;
  border: none !important;
  display: inline-block;
  font-size: 20px;
  font-weight: 400;
  margin-right: 10px;
  padding: 24px 0 24px 5px;
  text-align: center;
  width: 50px;
}

.fxac {
  display: flex;
  flex-direction: row;
  align-items: center;
}
/* Google Button CSS */
</style>
