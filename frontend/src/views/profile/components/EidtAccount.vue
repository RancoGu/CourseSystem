<template>
  <el-form>
    <el-form-item label="姓名">
      <el-input ref="name" v-model="user.name" />
    </el-form-item>
    <el-form-item label="简介">
      <el-input ref="info" v-model="user.info" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { post } from '@/api/client'

const UpdataUserInfo = {
  name: '',
  info: ''
}

export default {
  data() {
    return {
      user: UpdataUserInfo
    }
  },
  methods: {
    submit() {
      post('user/edit_info', {
        userId: this.$store.getters.userId,
        name: UpdataUserInfo.name,
        info: UpdataUserInfo.info
      })
      this.$message({
        message: 'User information has been updated successfully',
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>
