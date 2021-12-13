<template>
  <div id="app">
    <router-view :key="$route.fullPath" class="page-content" />
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    if (!window.gapi) {
      throw new Error(
        '"https://apis.google.com/js/api.js" needs to be included as a <script>.'
      );
    }

    if (!process.env.GAPI_OAUTH_CLIENT_ID) {
      throw new Error("Client Id must be specified.");
    }

    window.gapi.load("auth2", () => {
      window.gapi.auth2.init({
        client_id: process.env.GAPI_OAUTH_CLIENT_ID,
        hosted_domain: "one-line.com",
        scope: 'profile email'
      });
    });
  },
};
</script>
<style>
#app {
  /* font-family: SourceSansPro, "Helvetica Neue", Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
}

body {
  background: #eee;
}

.fixed-header {
  position: fixed;
  top: 0px;
  width: 100%;
  z-index: 99;
}

.page-content {
  margin-top: 50px;
}
</style>
